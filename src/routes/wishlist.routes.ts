import { Router } from 'express';
import auth from '../middlewares/auth';
import validateRequest from '../middlewares/validateReauest';
import { wishlistValidation } from '../services/wishlist/wishlist.validation';
import { wishlistController } from '../services/wishlist/wishlist.controller';


const router = Router();

// All wishlist routes require login (any role)
router.post(
  '/',
  auth(),
  validateRequest(wishlistValidation.addToWishlistSchema),
  wishlistController.addToWishlist,
);

router.get('/', auth(), wishlistController.getMyWishlist);

router.delete('/:productId', auth(), wishlistController.removeFromWishlist);

export const wishlistRoutes = router;