import shipment from '../models/shipment.model.js';

export const getAllshipments = async (req, res) => {
  try {
    const items = await shipment.find().sort('-createdAt');
    res.json({ success: true, count: items.length, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getshipmentById = async (req, res) => {
  try {
    const item = await shipment.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createshipment = async (req, res) => {
  try {
    const item = await shipment.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateshipment = async (req, res) => {
  try {
    const item = await shipment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteshipment = async (req, res) => {
  try {
    await shipment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
