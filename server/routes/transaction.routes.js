import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', (req, res) => {
  res.json({ success: true, message: 'Transactions route working' });
});

export default router;
