// backend/controllers/livestock.controller.js
import Livestock from '../models/Livestock.model.js';

export const getAllLivestock = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    let filter = {};
    
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }
    
    const livestock = await Livestock.find(filter).populate('owner', 'name email').sort('-createdAt');
    res.json({ success: true, count: livestock.length, livestock });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLivestockByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const livestock = await Livestock.find({ category, status: 'AVAILABLE' }).populate('owner', 'name');
    res.json({ success: true, count: livestock.length, livestock });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLivestockById = async (req, res) => {
  try {
    const livestock = await Livestock.findById(req.params.id).populate('owner', 'name email phone');
    if (!livestock) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, livestock });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createLivestock = async (req, res) => {
  try {
    const livestock = await Livestock.create({ ...req.body, owner: req.user._id });
    res.status(201).json({ success: true, livestock });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateLivestock = async (req, res) => {
  try {
    const livestock = await Livestock.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, livestock });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteLivestock = async (req, res) => {
  try {
    await Livestock.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};