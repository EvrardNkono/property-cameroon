import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { updateUser, uploadAvatar, uploadKYCDocument } from '../controllers/user.controller.js';
import upload, { uploadAvatar as uploadAvatarMiddleware, uploadKYC as uploadKYCMiddleware } from '../middleware/upload.middleware.js';

const router = express.Router();

router.use(protect);

// Obtenir mon profil (utilise déjà GET /api/auth/me)
// GET /api/auth/me existe déjà dans auth.routes.js

// Mettre à jour mon profil
router.put('/me', async (req, res) => {
  try {
    req.params.id = req.user._id;
    return updateUser(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Upload mon avatar
router.post('/me/avatar', uploadAvatarMiddleware.single('avatar'), async (req, res) => {
  try {
    req.params.id = req.user._id;
    return uploadAvatar(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Upload mon document KYC
router.post('/me/kyc-document', uploadKYCMiddleware.single('document'), async (req, res) => {
  try {
    req.params.id = req.user._id;
    return uploadKYCDocument(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Obtenir mon statut KYC
router.get('/me/kyc-status', async (req, res) => {
  try {
    const user = req.user;
    res.json({ 
      success: true, 
      kycStatus: user.kycStatus,
      kycDocuments: user.kycDocuments 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;