// backend/controllers/agriculturalProduct.controller.js
import AgriculturalProduct from '../models/AgriculturalProduct.model.js';

// Get all agricultural products
export const getAllProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, status } = req.query;
    let filter = {};
    
    // ✅ Si l'utilisateur n'est pas admin, filtrer ses propres produits
    const isAdmin = req.user?.roles?.includes('ADMIN');
    if (!isAdmin) {
      filter.seller = req.user._id;
    }
    
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
    console.error('getAllProducts error:', error);
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
    
    // ✅ Vérifier que l'utilisateur a le droit de voir ce produit
    const isAdmin = req.user?.roles?.includes('ADMIN');
    if (!isAdmin && product.seller._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    res.json({ success: true, product });
  } catch (error) {
    console.error('getProductById error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new product
export const createProduct = async (req, res) => {
  try {
    console.log('📦 Creating product for user:', req.user._id);
    console.log('📦 Product data:', JSON.stringify(req.body, null, 2));
    
    // ✅ Validation des champs requis
    if (!req.body.name) {
      return res.status(400).json({ success: false, message: 'Product name is required' });
    }
    if (!req.body.category) {
      return res.status(400).json({ success: false, message: 'Category is required' });
    }
    
    const productData = {
      name: req.body.name,
      category: req.body.category,
      price: {
        amount: typeof req.body.price === 'object' ? req.body.price.amount : parseFloat(req.body.price),
        currency: req.body.price?.currency || 'FCFA'
      },
      unit: req.body.unit || 'Kg',
      origin: req.body.origin || '',
      stock: parseInt(req.body.stock) || 0,
      description: req.body.description || '',
      images: req.body.images || [],
      certifications: req.body.certifications || [],
      harvestDate: req.body.harvestDate || null,
      expiryDate: req.body.expiryDate || null,
      status: req.body.status || 'PENDING',
      seller: req.user._id
    };
    
    const product = await AgriculturalProduct.create(productData);
    console.log('✅ Product created:', product._id);
    
    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error('❌ createProduct error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    // ✅ Vérifier d'abord que le produit existe et appartient à l'utilisateur
    const existingProduct = await AgriculturalProduct.findById(req.params.id);
    
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    const isAdmin = req.user?.roles?.includes('ADMIN');
    if (!isAdmin && existingProduct.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    const updateData = {
      name: req.body.name || existingProduct.name,
      category: req.body.category || existingProduct.category,
      price: {
        amount: req.body.price?.amount || req.body.price || existingProduct.price.amount,
        currency: req.body.price?.currency || existingProduct.price.currency
      },
      unit: req.body.unit || existingProduct.unit,
      origin: req.body.origin !== undefined ? req.body.origin : existingProduct.origin,
      stock: req.body.stock !== undefined ? parseInt(req.body.stock) : existingProduct.stock,
      description: req.body.description !== undefined ? req.body.description : existingProduct.description,
      images: req.body.images || existingProduct.images,
      certifications: req.body.certifications || existingProduct.certifications,
      harvestDate: req.body.harvestDate || existingProduct.harvestDate,
      expiryDate: req.body.expiryDate || existingProduct.expiryDate,
      status: req.body.status || existingProduct.status
    };
    
    const product = await AgriculturalProduct.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    console.log('✅ Product updated:', product._id);
    res.json({ success: true, product });
  } catch (error) {
    console.error('❌ updateProduct error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    // ✅ Vérifier d'abord que le produit existe et appartient à l'utilisateur
    const existingProduct = await AgriculturalProduct.findById(req.params.id);
    
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    const isAdmin = req.user?.roles?.includes('ADMIN');
    if (!isAdmin && existingProduct.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    await AgriculturalProduct.findByIdAndDelete(req.params.id);
    
    console.log('✅ Product deleted:', existingProduct._id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('❌ deleteProduct error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get products by category
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    let filter = { category, status: 'PUBLISHED' };
    
    // ✅ Si l'utilisateur n'est pas admin, filtrer ses propres produits
    const isAdmin = req.user?.roles?.includes('ADMIN');
    if (!isAdmin && req.user) {
      filter.seller = req.user._id;
    }
    
    const products = await AgriculturalProduct.find(filter).populate('seller', 'name');
    
    res.json({ success: true, count: products.length, products });
  } catch (error) {
    console.error('getProductsByCategory error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};