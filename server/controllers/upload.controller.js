// backend/controllers/upload.controller.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { put } from '@vercel/blob';

// 🔍 DEBUG - Afficher les infos d'environnement au chargement
console.log('=== UPLOAD CONTROLLER INITIALIZED ===');
console.log('process.env.VERCEL:', process.env.VERCEL);
console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
console.log('BLOB_READ_WRITE_TOKEN exists:', !!process.env.BLOB_READ_WRITE_TOKEN);

// Détecter si on est sur Vercel - Version robuste
const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
console.log('isVercel détecté:', isVercel);
console.log('=====================================');

// Configuration mémoire pour multer (nécessaire pour Vercel)
const memoryStorage = multer.memoryStorage();

// Service de stockage unifié
const saveFile = async (file, folder) => {
  console.log(`📁 saveFile - isVercel: ${isVercel}, folder: ${folder}, file: ${file.originalname}, size: ${file.size} bytes`);
  
  if (isVercel) {
    console.log('☁️ Tentative upload vers Vercel Blob...');
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = `${folder}-${timestamp}-${random}${ext}`;
    
    try {
      const blob = await put(`${folder}/${filename}`, file.buffer, {
        access: 'public',
        addRandomSuffix: true,
      });
      console.log('✅ Succès - URL Blob:', blob.url);
      return blob.url;
    } catch (blobError) {
      console.error('❌ Erreur Vercel Blob détaillée:', blobError);
      console.error('Erreur nom:', blobError.name);
      console.error('Erreur message:', blobError.message);
      throw blobError;
    }
  } else {
    console.log('💾 Sauvegarde locale...');
    const uploadDir = `uploads/${folder}/`;
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('📁 Dossier créé:', uploadDir);
    }
    
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1E9);
    const filename = `${folder}-${timestamp}-${random}${path.extname(file.originalname)}`;
    const filepath = path.join(uploadDir, filename);
    
    fs.writeFileSync(filepath, file.buffer);
    console.log('✅ Fichier sauvegardé:', filepath);
    
    return `/uploads/${folder}/${filename}`;
  }
};

const saveMultipleFiles = async (files, folder) => {
  console.log(`📦 saveMultipleFiles - ${files.length} fichiers à uploader dans ${folder}`);
  const urls = [];
  for (let i = 0; i < files.length; i++) {
    console.log(`  Uploading fichier ${i+1}/${files.length}`);
    const url = await saveFile(files[i], folder);
    urls.push(url);
  }
  console.log(`✅ ${urls.length} fichiers uploadés avec succès`);
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
  console.log('🖼️ handlePropertyImages appelé');
  console.log('  req.files:', req.files ? `${req.files.length} fichiers` : 'aucun fichier');
  
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      console.log('❌ Aucun fichier reçu');
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }
    
    console.log(`📤 Upload de ${files.length} images pour les propriétés`);
    const imageUrls = await saveMultipleFiles(files, 'properties');
    
    console.log('✅ Upload terminé avec succès');
    res.json({ success: true, images: imageUrls });
  } catch (error) {
    console.error('❌ Erreur dans handlePropertyImages:', error);
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