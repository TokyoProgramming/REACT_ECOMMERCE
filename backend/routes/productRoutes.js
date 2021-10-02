import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductById,
  getTopProduct,
  deleteProduct,
  updateProduct,
  createProduct,
  createProductReview,
  updateCountInStock,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getProducts).post(protect, admin, createProduct).delete;
router.get('/top', getTopProduct);
router.put('/countinstock', updateCountInStock);

router
  .route('/:id')
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);
router.route('/:id/reviews').post(protect, createProductReview);

export default router;
