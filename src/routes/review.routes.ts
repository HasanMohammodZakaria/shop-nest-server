import auth from '../middlewares/auth';
import validateRequest from '../middlewares/validateReauest';
import { reviewController } from '../services/review/review.controller';
import { reviewValidation } from '../services/review/review.validation';
import { Router } from 'express';


const router = Router();

// Public routes
router.get('/recent', reviewController.getRecentReviews);
router.get('/product/:productId', reviewController.getReviewsByProduct);
router.get('/:id', reviewController.getReviewById);

// Logged-in user routes (any role)
router.post(
  '/',
  auth(),
  validateRequest(reviewValidation.createReviewSchema),
  reviewController.createReview,
);

router.patch(
  '/:id',
  auth(),
  validateRequest(reviewValidation.updateReviewSchema),
  reviewController.updateReview,
);

router.delete('/:id', auth(), reviewController.deleteReview);

export const reviewRoutes = router;