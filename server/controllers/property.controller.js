import Property from '../models/Property.model.js';

export const getAllProperties = async (req, res) => {
  try {
    const { status, category, owner, search } = req.query;
    let filter = {};
    if (status && status !== 'ALL') filter.status = status;
    if (category) filter.category = category;
    if (owner) filter.owner = owner;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } }
      ];
    }
    const properties = await Property.find(filter).populate('owner', 'name email').sort('-createdAt');
    const totalValue = properties.reduce((sum, p) => sum + (p.price?.amount || 0), 0);
    res.json({ success: true, count: properties.length, totalValue, properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner', 'name email phone');
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    res.json({ success: true, property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProperty = async (req, res) => {
  try {
    const property = await Property.create({ ...req.body, owner: req.user._id });
    res.status(201).json({ success: true, property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPropertiesByOwner = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.params.ownerId }).sort('-createdAt');
    res.json({ success: true, properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
