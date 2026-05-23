// backend/controllers/upload.controller.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { put } from '@vercel/blob';

// Détecter si on est sur Vercel
const isVercel = process.env.VERCEL === '1';

// Configuration mémoire pour multer (nécessaire pour Vercel)
const memoryStorage = multer.memoryStorage();

// Service de stockage unifié
const saveFile = async (file, folder) => {
  if (isVercel) {
    // 🇻🇪 Sur Vercel : utilise Vercel Blob
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1E9);
    const filename = `${folder}-${timestamp}-${random}${path.extname(file.originalname)}`;
    
    const blob = await put(`${folder}/${filename}`, file.buffer, {
      access: 'public',
      addRandomSuffix: true,
    });
    
    return blob.url;
  } else {
    // 💻 En local : utilise le disque
    const uploadDir = `uploads/${folder}/`;
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1E9);
    const filename = `${folder}-${timestamp}-${random}${path.extname(file.originalname)}`;
    const filepath = path.join(uploadDir, filename);
    
    fs.writeFileSync(filepath, file.buffer);
    
    return `/uploads/${folder}/${filename}`;
  }
};

const saveMultipleFiles = async (files, folder) => {
  const urls = [];
  for (const file of files) {
    const url = await saveFile(file, folder);
    urls.push(url);
  }
  return urls;
};

// Multer configuré avec memoryStorage (fonctionne partout)
const upload = multer({ 
  storage: memoryStorage,
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
    
    const imageUrls = await saveMultipleFiles(files, 'properties');
    
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
    
    const imageUrls = await saveMultipleFiles(files, 'livestock');
    
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
    
    const imageUrls = await saveMultipleFiles(files, 'agriculture');
    
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
    
    const imageUrl = await saveFile(file, 'categories');
    
    res.json({ success: true, image: imageUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Export des configurations multer (pour compatibilité)
export const propertyUpload = upload;
export const livestockUpload = upload;
export const agricultureUpload = upload;
export const categoryUpload = upload;