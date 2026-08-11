import { Router } from 'express';
import auth from '../middlewares/auth';
import validateRequest from '../middlewares/validateReauest';
import { userController } from '../services/user/user.controller';
import { userValidation } from '../services/user/user.validation';


const router = Router();

// Self-service routes (any logged-in user)
router.get('/me', auth(), userController.getMyProfile);

router.patch(
  '/me',
  auth(),
  validateRequest(userValidation.updateProfileSchema),
  userController.updateMyProfile,
);

router.patch(
  '/me/password',
  auth(),
  validateRequest(userValidation.changePasswordSchema),
  userController.changeMyPassword,
);

// Admin-only routes
router.get('/', auth('ADMIN'), userController.getAllUsers);

router.get('/:id', auth('ADMIN'), userController.getUserById);

router.patch(
  '/:id/role',
  auth('ADMIN'),
  validateRequest(userValidation.updateRoleSchema),
  userController.updateUserRole,
);

router.delete('/:id', auth('ADMIN'), userController.deleteUser);

export const userRoutes = router;