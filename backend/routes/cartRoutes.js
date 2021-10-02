import express from 'express';
const router = express.Router();
import {
  addToCart,
  getMyCart,
  deleteCartItem,
  getAllCarts,
  updateUserCart,
  deleteAllCartItems,
} from '../controllers/cartController.js';
import { admin, protect } from '../middleware/authMiddleware.js';

router
  .route('/')
  .post(protect, addToCart)
  .get(protect, getMyCart)
  .put(protect, updateUserCart)
  .delete(protect, deleteAllCartItems);

router.route('/:id').delete(protect, deleteCartItem);

// .put(protect, updateUserCart);

router.route('/all').get(protect, admin, getAllCarts);

export default router;
