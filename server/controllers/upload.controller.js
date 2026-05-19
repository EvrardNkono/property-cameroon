// backend/controllers/upload.controller.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configuration multer pour les images de propriétés
const propertyStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/properties/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'property-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configuration multer pour les images de livestock
const livestockStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/livestock/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'livestock-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configuration multer pour les images de produits agricoles
const agricultureStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/agriculture/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'agriculture-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configuration multer pour les catégories de livestock
const categoryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/categories/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'category-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Middleware multer avec limites
const upload = multer({ 
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Uploaders spécifiques
export const uploadPropertyImages = upload.array('images', 10);
export const uploadLivestockImages = upload.array('images', 10);
export const uploadAgricultureImages = upload.array('images', 10);
export const uploadCategoryImage = upload.single('image');

// Handlers pour les différents types d'upload
export const handlePropertyImages = async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }
    
    const imageUrls = files.map(file => `/uploads/properties/${file.filename}`);
    
    res.json({ success: true, images: imageUrls });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const handleLivestockImages = async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }
    
    const imageUrls = files.map(file => `/uploads/livestock/${file.filename}`);
    
    res.json({ success: true, images: imageUrls });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const handleAgricultureImages = async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }
    
    const imageUrls = files.map(file => `/uploads/agriculture/${file.filename}`);
    
    res.json({ success: true, images: imageUrls });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const handleCategoryImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    const imageUrl = `/uploads/categories/${file.filename}`;
    
    res.json({ success: true, image: imageUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Export des configurations multer pour utilisation dans les routes
export const propertyUpload = multer({ storage: propertyStorage, limits: { fileSize: 10 * 1024 * 1024 } });
export const livestockUpload = multer({ storage: livestockStorage, limits: { fileSize: 10 * 1024 * 1024 } });
export const agricultureUpload = multer({ storage: agricultureStorage, limits: { fileSize: 10 * 1024 * 1024 } });
export const categoryUpload = multer({ storage: categoryStorage, limits: { fileSize: 5 * 1024 * 1024 } });