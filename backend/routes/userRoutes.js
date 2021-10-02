import express from 'express';
const router = express.Router();
import {
  authUser,
  getAllUsers,
  getUserProfile,
  registerUser,
  updateUserProfile,
  deleteUser,
  getUserById,
  updateUser,
  twoFactorGenerateToken,
  twoFactorVerifyToken,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(registerUser).get(protect, admin, getAllUsers);
router.post('/login', authUser);
router.post('/generate', twoFactorGenerateToken);
router.post('/:id/verify', twoFactorVerifyToken);

router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router
  .route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

export default router;
