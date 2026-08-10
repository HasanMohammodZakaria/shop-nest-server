import { Router } from 'express';
import { categoryController } from '../services/category/category.controller';

import { categoryValidation } from '../services/category/category.validation';
import auth from '../middlewares/auth';
import validateRequest from '../middlewares/validateReauest';

const router = Router();

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Admin-only routes
router.post(
  '/',
  auth('ADMIN'),
  validateRequest(categoryValidation.createCategorySchema),
  categoryController.createCategory,
);
router.patch(
  '/:id',
  auth('ADMIN'),
  validateRequest(categoryValidation.updateCategorySchema),
  categoryController.updateCategory,
);
router.delete('/:id', auth('ADMIN'), categoryController.deleteCategory);

export const categoryRoutes = router;