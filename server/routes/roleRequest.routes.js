import express from 'express';
import { 
  submitRoleRequest, 
  getMyRoleRequests, 
  getAllRoleRequests, 
  approveRoleRequest, 
  rejectRoleRequest 
} from '../controllers/roleRequest.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

// Routes utilisateur
router.post('/', submitRoleRequest);
router.get('/my', getMyRoleRequests);

// Routes admin
router.get('/', authorize('ADMIN'), getAllRoleRequests);
router.put('/:id/approve', authorize('ADMIN'), approveRoleRequest);
router.put('/:id/reject', authorize('ADMIN'), rejectRoleRequest);

export default router;