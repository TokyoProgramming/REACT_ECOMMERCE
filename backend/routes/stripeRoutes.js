import express from 'express';
const router = express.Router();
import { chargeStripe } from '../controllers/stripeController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/:id/charge').post(protect, chargeStripe);

export default router;
