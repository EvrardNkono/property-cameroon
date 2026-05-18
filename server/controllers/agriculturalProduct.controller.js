// backend/controllers/agriculturalProduct.controller.js
import AgriculturalProduct from '../models/AgriculturalProduct.model.js';

// Get all agricultural products
export const getAllProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, status } = req.query;
    let filter = {};
    
    if (status) filter.status = status;
    if (category && category !== 'All') filter.category = category;
    if (minPrice) filter['price.amount'] = { $gte: parseFloat(minPrice) };
    if (maxPrice) filter['price.amount'] = { $lte: parseFloat(maxPrice) };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { origin: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const products = await AgriculturalProduct.find(filter)
      .populate('seller', 'name email')
      .sort('-createdAt');
    
    res.json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await AgriculturalProduct.findById(req.params.id)
      .populate('seller', 'name email phone');
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new product
export const createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      seller: req.user._id
    };
    
    const product = await AgriculturalProduct.create(productData);
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const product = await AgriculturalProduct.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await AgriculturalProduct.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get products by category
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await AgriculturalProduct.find({ 
      category, 
      status: 'PUBLISHED' 
    }).populate('seller', 'name');
    
    res.json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};