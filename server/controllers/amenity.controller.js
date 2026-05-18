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
export const getAmenitiesNearProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { radius = 5 } = req.query; // rayon en km par défaut
    
    const property = await Property.findById(propertyId);
    if (!property || !property.location?.coordinates) {
      return res.status(404).json({ success: false, message: 'Property or coordinates not found' });
    }
    
    // Recherche par rayon (si vous avez des coordonnées)
    const amenities = await Amenity.find({
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
        case 'market': key = 'markets'; break;
        case 'station': key = 'stations'; break;
        case 'bakery': key = 'bakeries'; break;
        default: return;
      }
      grouped[key].count++;
      grouped[key].names.push(amenity.name);
    });
    
    res.json({ success: true, amenities: grouped });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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