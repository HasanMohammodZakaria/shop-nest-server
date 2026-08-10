import requireAdmin from '../middlewares/requireAdmin';
import auth from '../middlewares/auth';
import { productController } from '../services/product/product.controller';
import { Router } from 'express';
import validateRequest from '../middlewares/validateReauest';
import { productValidation } from '../services/product/product.validation';


const router = Router();

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Admin-only routes
router.post(
  '/',
  auth(),
  requireAdmin,
  validateRequest(productValidation.createProductSchema),
  productController.createProduct,
);

router.patch(
  '/:id',
  auth(),
  requireAdmin,
  validateRequest(productValidation.updateProductSchema),
  productController.updateProduct,
);

router.delete('/:id', auth(), requireAdmin, productController.deleteProduct);

export const productRoutes = router;