import document from '../models/document.model.js';

export const getAlldocuments = async (req, res) => {
  try {
    const items = await document.find().sort('-createdAt');
    res.json({ success: true, count: items.length, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getdocumentById = async (req, res) => {
  try {
    const item = await document.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createdocument = async (req, res) => {
  try {
    const item = await document.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatedocument = async (req, res) => {
  try {
    const item = await document.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletedocument = async (req, res) => {
  try {
    await document.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
