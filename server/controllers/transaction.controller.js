import transaction from '../models/transaction.model.js';

export const getAlltransactions = async (req, res) => {
  try {
    const items = await transaction.find().sort('-createdAt');
    res.json({ success: true, count: items.length, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const gettransactionById = async (req, res) => {
  try {
    const item = await transaction.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createtransaction = async (req, res) => {
  try {
    const item = await transaction.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatetransaction = async (req, res) => {
  try {
    const item = await transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletetransaction = async (req, res) => {
  try {
    await transaction.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
