// backend/controllers/agricultural.controller.js
import AgriculturalLand from '../models/AgriculturalLand.model.js';

// Obtenir toutes les terres agricoles
export const getAllAgriculturalLands = async (req, res) => {
  try {
    const { region, crop, soilType, minSurface, maxPrice, status, search } = req.query;
    let filter = {};
    
    if (status && status !== 'ALL') filter.status = status;
    if (region) filter['location.region'] = region;
    if (soilType) filter['agricultureDetails.soilType'] = soilType;
    if (crop) {
      filter.$or = [
        { 'agricultureDetails.primaryCrop': crop },
        { 'agricultureDetails.cropCompatibility': crop }
      ];
    }
    if (minSurface) filter['surface.value'] = { $gte: parseFloat(minSurface) };
    if (maxPrice) filter['price.amount'] = { $lte: parseFloat(maxPrice) };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } }
      ];
    }
    
    const lands = await AgriculturalLand.find(filter)
      .populate('owner', 'name email')
      .sort('-createdAt');
    
    res.json({ success: true, count: lands.length, lands });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtenir une terre agricole par ID
export const getAgriculturalLandById = async (req, res) => {
  try {
    const land = await AgriculturalLand.findById(req.params.id)
      .populate('owner', 'name email phone');
    
    if (!land) {
      return res.status(404).json({ success: false, message: 'Terre agricole non trouvée' });
    }
    
    res.json({ success: true, land });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Créer une nouvelle terre agricole
export const createAgriculturalLand = async (req, res) => {
  try {
    const landData = {
      ...req.body,
      owner: req.user._id
    };
    
    const land = await AgriculturalLand.create(landData);
    res.status(201).json({ success: true, land });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mettre à jour une terre agricole
export const updateAgriculturalLand = async (req, res) => {
  try {
    const land = await AgriculturalLand.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!land) {
      return res.status(404).json({ success: false, message: 'Terre agricole non trouvée' });
    }
    
    res.json({ success: true, land });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Supprimer une terre agricole
export const deleteAgriculturalLand = async (req, res) => {
  try {
    const land = await AgriculturalLand.findByIdAndDelete(req.params.id);
    
    if (!land) {
      return res.status(404).json({ success: false, message: 'Terre agricole non trouvée' });
    }
    
    res.json({ success: true, message: 'Terre agricole supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Filtrer par culture (matching intelligence)
export const filterByCrop = async (req, res) => {
  try {
    const { crop } = req.params;
    
    const lands = await AgriculturalLand.find({
      status: 'PUBLISHED',
      $or: [
        { 'agricultureDetails.primaryCrop': crop },
        { 'agricultureDetails.cropCompatibility': crop }
      ]
    }).populate('owner', 'name email');
    
    // Calculer un score de match pour chaque terre
    const landsWithScore = lands.map(land => {
      let score = 70;
      
      // Bonus selon le type de culture
      if (land.agricultureDetails.primaryCrop === crop) score += 15;
      if (land.agricultureDetails.soilQuality > 70) score += 10;
      if (land.agricultureDetails.waterAccess) score += 10;
      if (land.agricultureDetails.electricityAccess) score += 5;
      if (land.agricultureDetails.roadAccess === 'paved') score += 5;
      
      // Terrain plat = bonus
      if (land.agricultureDetails.slope === 'flat') score += 5;
      
      land.matchScore = Math.min(100, score);
      return land;
    }).sort((a, b) => b.matchScore - a.matchScore);
    
    res.json({ success: true, count: landsWithScore.length, lands: landsWithScore });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtenir les régions avec leurs statistiques
export const getRegionStats = async (req, res) => {
  try {
    const stats = await AgriculturalLand.aggregate([
      { $match: { status: 'PUBLISHED' } },
      { $group: {
        _id: '$location.region',
        count: { $sum: 1 },
        avgPricePerHectare: { $avg: '$price.perHectare' },
        totalSurface: { $sum: '$surface.value' }
      }},
      { $sort: { count: -1 } }
    ]);
    
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};