// backend/controllers/amenity.controller.js
import Amenity from '../models/Amenity.model.js';
import Property from '../models/Property.model.js';

// Obtenir toutes les amenities
export const getAllAmenities = async (req, res) => {
  try {
    const { type, city, search } = req.query;
    let filter = {};
    
    if (type) filter.type = type;
    if (city) filter['location.city'] = { $regex: city, $options: 'i' };
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    
    const amenities = await Amenity.find(filter).sort('name');
    res.json({ success: true, count: amenities.length, amenities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtenir les amenities près d'une propriété
// Obtenir les amenities près d'une propriété
export const getAmenitiesNearProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { radius = 5 } = req.query; // rayon en km par défaut
    
    const property = await Property.findById(propertyId);
    
    // ✅ Vérification plus stricte des coordonnées
    if (!property) {
      return res.status(404).json({ 
        success: false, 
        message: 'Property not found',
        amenities: {
          schools: { count: 0, names: [] },
          markets: { count: 0, names: [] },
          stations: { count: 0, names: [] },
          bakeries: { count: 0, names: [] }
        }
      });
    }
    
    // ✅ Vérifier si les coordonnées existent et sont valides
    const hasValidCoordinates = property.location?.coordinates && 
                                typeof property.location.coordinates.lat === 'number' &&
                                typeof property.location.coordinates.lng === 'number' &&
                                !isNaN(property.location.coordinates.lat) &&
                                !isNaN(property.location.coordinates.lng);
    
    if (!hasValidCoordinates) {
      // ✅ Retourner des données vides au lieu d'une erreur
      console.log(`Property ${propertyId} has no valid coordinates, returning empty amenities`);
      return res.json({ 
        success: true, 
        message: 'No coordinates available for this property',
        amenities: {
          schools: { count: 0, names: [] },
          markets: { count: 0, names: [] },
          stations: { count: 0, names: [] },
          bakeries: { count: 0, names: [] }
        }
      });
    }
    
    // ✅ Recherche par rayon avec coordonnées valides
    let amenities = [];
    try {
      amenities = await Amenity.find({
        'location.coordinates': {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [property.location.coordinates.lng, property.location.coordinates.lat]
            },
            $maxDistance: radius * 1000 // conversion en mètres
          }
        }
      }).limit(20);
    } catch (dbError) {
      console.error('MongoDB geo query error:', dbError);
      // Si la requête géo échoue, retourner des données vides
      return res.json({ 
        success: true, 
        message: 'Geo query failed, no amenities found',
        amenities: {
          schools: { count: 0, names: [] },
          markets: { count: 0, names: [] },
          stations: { count: 0, names: [] },
          bakeries: { count: 0, names: [] }
        }
      });
    }
    
    // Grouper par type
    const grouped = {
      schools: { count: 0, names: [] },
      markets: { count: 0, names: [] },
      stations: { count: 0, names: [] },
      bakeries: { count: 0, names: [] }
    };
    
    amenities.forEach(amenity => {
      let key;
      switch (amenity.type) {
        case 'school': key = 'schools'; break;
        case 'university': key = 'schools'; break;
        case 'market': key = 'markets'; break;
        case 'supermarket': key = 'markets'; break;
        case 'station': key = 'stations'; break;
        case 'gas_station': key = 'stations'; break;
        case 'bakery': key = 'bakeries'; break;
        case 'restaurant': key = 'bakeries'; break;
        default: return;
      }
      grouped[key].count++;
      if (grouped[key].names.length < 10) { // Limiter à 10 noms
        grouped[key].names.push(amenity.name);
      }
    });
    
    res.json({ success: true, amenities: grouped });
    
  } catch (error) {
    console.error('Error in getAmenitiesNearProperty:', error);
    // ✅ Toujours retourner un objet valide même en cas d'erreur
    res.status(500).json({ 
      success: false, 
      message: error.message,
      amenities: {
        schools: { count: 0, names: [] },
        markets: { count: 0, names: [] },
        stations: { count: 0, names: [] },
        bakeries: { count: 0, names: [] }
      }
    });
  }
};

// Créer une amenity (admin)
export const createAmenity = async (req, res) => {
  try {
    const amenity = await Amenity.create(req.body);
    res.status(201).json({ success: true, amenity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mettre à jour une amenity
export const updateAmenity = async (req, res) => {
  try {
    const amenity = await Amenity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, amenity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Supprimer une amenity
export const deleteAmenity = async (req, res) => {
  try {
    await Amenity.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Amenity deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};