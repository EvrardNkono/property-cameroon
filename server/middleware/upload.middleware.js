import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Créer les dossiers s'ils n'existent pas
const uploadDirs = ['uploads/', 'uploads/avatars/', 'uploads/kyc/', 'uploads/documents/'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Dossier créé: ${dir}`);
  }
});

// Configuration du stockage pour les avatars
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${req.params.id}-${uniqueSuffix}${ext}`);
  }
});

// Configuration du stockage pour les documents KYC
const kycStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/kyc/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `kyc-${req.params.id}-${uniqueSuffix}${ext}`);
  }
});

// Configuration du stockage pour les documents généraux
const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/documents/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `doc-${uniqueSuffix}${ext}`);
  }
});

// Filtre pour les images
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées (jpeg, jpg, png, gif)'));
  }
};

// Filtre pour les documents
const documentFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Format non supporté. Utilisez PDF, JPG, PNG, DOC ou DOCX'));
  }
};

// Middlewares d'upload
export const uploadAvatar = multer({ 
  storage: avatarStorage, 
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: imageFilter 
});

export const uploadKYC = multer({ 
  storage: kycStorage, 
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: documentFilter 
});

export const uploadDocument = multer({ 
  storage: documentStorage, 
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: documentFilter 
});

// Middleware générique (pour compatibilité)
const upload = multer({
  storage: documentStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: documentFilter
});

export default upload;