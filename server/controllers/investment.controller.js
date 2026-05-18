import investment from '../models/investment.model.js';

export const getAllinvestments = async (req, res) => {
  try {
    const items = await investment.find().sort('-createdAt');
    res.json({ success: true, count: items.length, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getinvestmentById = async (req, res) => {
  try {
    const item = await investment.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createinvestment = async (req, res) => {
  try {
    const item = await investment.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateinvestment = async (req, res) => {
  try {
    const item = await investment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteinvestment = async (req, res) => {
  try {
    await investment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
