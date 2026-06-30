// backend/routes/translate.routes.js
import express from 'express';
import { translateBatch } from '../controllers/translate.controller.js';

const router = express.Router();
router.post('/batch', translateBatch);

export default router;