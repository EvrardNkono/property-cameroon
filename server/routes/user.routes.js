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
import { uploadAvatar as uploadAvatarMiddleware, uploadKYC as uploadKYCMiddleware } from '../middleware/upload.middleware.js';

const router = express.Router();

// ✅ Toutes les routes nécessitent d'être connecté
router.use(protect);

// ✅ Route auto-modification des rôles — AVANT le bloc authorize('ADMIN')
// Un utilisateur peut modifier ses propres rôles, un ADMIN peut modifier n'importe qui
router.put('/:id/roles', authorizeRolesUpdate, updateUserRoles);

// ✅ Toutes les autres routes réservées ADMIN
router.use(authorize('ADMIN'));

router.get('/', getAllUsers);
router.get('/pending', getPendingUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.put('/:id/ban', banUser);
router.put('/:id/kyc', verifyKYC);
router.put('/:id/approve', approveUser);
router.put('/:id/reject', rejectUser);
router.delete('/:id', deleteUser);
router.post('/:id/avatar', uploadAvatarMiddleware.single('avatar'), uploadAvatar);
router.post('/:id/kyc-document', uploadKYCMiddleware.single('document'), uploadKYCDocument);

export default router;

// ✅ Middleware : autorisé si c'est son propre compte OU si ADMIN
function authorizeRolesUpdate(req, res, next) {
  const requestingUserId = req.user._id.toString();
  const targetUserId = req.params.id;

  if (requestingUserId === targetUserId || req.user.roles?.includes('ADMIN')) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Access denied. You can only modify your own roles.'
  });
}