// backend/routes/auth.routes.js
import express from 'express';
import multer from 'multer';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { put } from '@vercel/blob';

const isVercel = process.env.VERCEL === '1';

// Configuration multer avec memoryStorage (compatible Vercel)
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

const router = express.Router();

// Middleware pour traiter le fichier avant register
const handleKYCUpload = async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  
  try {
    if (isVercel) {
      // Sur Vercel : sauvegarde dans Blob
      const timestamp = Date.now();
      const random = Math.round(Math.random() * 1E9);
      const ext = req.file.originalname.split('.').pop();
      const filename = `kyc-${timestamp}-${random}.${ext}`;
      
      const blob = await put(`kyc/${filename}`, req.file.buffer, {
        access: 'public',
        addRandomSuffix: true,
      });
      
      req.file.filename = blob.url;
    } else {
      // En local : sauvegarde sur disque (garder l'ancien comportement)
      const fs = await import('fs');
      const path = await import('path');
      const uploadDir = 'uploads/kyc/';
      
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const timestamp = Date.now();
      const random = Math.round(Math.random() * 1E9);
      const ext = path.extname(req.file.originalname);
      const filename = `kyc-${timestamp}-${random}${ext}`;
      const filepath = path.join(uploadDir, filename);
      
      fs.writeFileSync(filepath, req.file.buffer);
      req.file.filename = filename;
    }
    
    next();
  } catch (error) {
    console.error('KYC upload error:', error);
    res.status(500).json({ success: false, message: 'Error uploading KYC document' });
  }
};

router.post('/register', upload.single('kycDocument'), handleKYCUpload, register);
router.post('/login', login);
router.get('/me', protect, getMe);

export default router;