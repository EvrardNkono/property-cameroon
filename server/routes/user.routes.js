import express from 'express';
import { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  updateUserRoles, 
  banUser, 
  verifyKYC, 
  deleteUser,
  uploadAvatar,
  uploadKYCDocument,
  approveUser,
  rejectUser,
  getPendingUsers
} from '../controllers/user.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import upload, { uploadAvatar as uploadAvatarMiddleware, uploadKYC as uploadKYCMiddleware } from '../middleware/upload.middleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/', getAllUsers);
router.get('/pending', getPendingUsers);  // 👈 NOUVEAU
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.put('/:id/roles', updateUserRoles);
router.put('/:id/ban', banUser);
router.put('/:id/kyc', verifyKYC);
router.put('/:id/approve', approveUser);  // 👈 NOUVEAU
router.put('/:id/reject', rejectUser);    // 👈 NOUVEAU
router.delete('/:id', deleteUser);

// Upload avatar
router.post('/:id/avatar', uploadAvatarMiddleware.single('avatar'), uploadAvatar);

// Upload document KYC
router.post('/:id/kyc-document', uploadKYCMiddleware.single('document'), uploadKYCDocument);

export default router;