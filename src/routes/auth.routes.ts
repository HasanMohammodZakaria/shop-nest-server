import { Router } from 'express';
import { authController } from '../services/auth/auth.controller';

import { authValidation } from '../services/auth/auth.validation';
import validateRequest from '../middlewares/validateReauest';

const router = Router();

router.post('/register', validateRequest(authValidation.registerSchema), authController.register);
router.post('/login', validateRequest(authValidation.loginSchema), authController.login);

export const authRoutes = router;