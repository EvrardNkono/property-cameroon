// backend/middleware/upload.middleware.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// ✅ Ajout du dossier pour les catégories livestock
const uploadDirs = [
  'uploads/', 
  'uploads/avatars/', 
  'uploads/kyc/', 
  'uploads/documents/',
  'uploads/categories/',      // ✅ Pour les catégories livestock
  'uploads/properties/',      // ✅ Pour les propriétés
  'uploads/livestock/',       // ✅ Pour les assets livestock
  'uploads/agriculture/'      // ✅ Pour l'agriculture
];

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
    cb(null, `avatar-${req.params.id || Date.now()}-${uniqueSuffix}${ext}`);
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
    cb(null, `kyc-${req.params.id || Date.now()}-${uniqueSuffix}${ext}`);
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

// ✅ Configuration du stockage pour les catégories livestock
const categoryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/categories/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `category-${uniqueSuffix}${ext}`);
  }
});

// ✅ Configuration du stockage pour les propriétés
const propertyStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/properties/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `property-${uniqueSuffix}${ext}`);
  }
});

// ✅ Configuration du stockage pour les assets livestock
const livestockStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/livestock/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `livestock-${uniqueSuffix}${ext}`);
  }
});

// ✅ Configuration du stockage pour l'agriculture
const agricultureStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/agriculture/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `agriculture-${uniqueSuffix}${ext}`);
  }
});

// Filtre pour les images
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées (jpeg, jpg, png, gif, webp)'));
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

// Middlewares d'upload existants
export const uploadAvatar = multer({ 
  storage: avatarStorage, 
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter 
});

export const uploadKYC = multer({ 
  storage: kycStorage, 
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: documentFilter 
});

export const uploadDocument = multer({ 
  storage: documentStorage, 
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: documentFilter 
});

// ✅ Nouveaux middlewares
export const uploadCategoryImage = multer({ 
  storage: categoryStorage, 
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter 
});

export const uploadPropertyImages = multer({ 
  storage: propertyStorage, 
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imageFilter 
});

export const uploadLivestockImages = multer({ 
  storage: livestockStorage, 
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imageFilter 
});

export const uploadAgricultureImages = multer({ 
  storage: agricultureStorage, 
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imageFilter 
});

// ✅ Upload multiple pour les images
export const uploadMultiple = uploadPropertyImages.array('images', 10);

// Middleware générique (pour compatibilité)
const upload = multer({
  storage: documentStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: documentFilter
});

export default upload;