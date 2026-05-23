// backend/middleware/upload.middleware.js
import multer from 'multer';
import path from 'path';

// Utiliser memoryStorage au lieu de diskStorage (compatible Vercel)
const memoryStorage = multer.memoryStorage();

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

// Middlewares d'upload avec memoryStorage (compatible Vercel)
export const uploadAvatar = multer({ 
  storage: memoryStorage, 
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter 
});

export const uploadKYC = multer({ 
  storage: memoryStorage, 
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: documentFilter 
});

export const uploadDocument = multer({ 
  storage: memoryStorage, 
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: documentFilter 
});

export const uploadCategoryImage = multer({ 
  storage: memoryStorage, 
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter 
});

export const uploadPropertyImages = multer({ 
  storage: memoryStorage, 
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imageFilter 
});

export const uploadLivestockImages = multer({ 
  storage: memoryStorage, 
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imageFilter 
});

export const uploadAgricultureImages = multer({ 
  storage: memoryStorage, 
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imageFilter 
});

export const uploadMultiple = uploadPropertyImages.array('images', 10);

// Middleware générique
const upload = multer({
  storage: memoryStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: documentFilter
});

export default upload;