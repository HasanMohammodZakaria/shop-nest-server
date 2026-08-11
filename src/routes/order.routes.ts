import { Router } from 'express';
import auth from '../middlewares/auth';
import validateRequest from '../middlewares/validateReauest';
import { orderValidation } from '../services/order/order.validation';
import { orderController } from '../services/order/order.controller';


const router = Router();

// Logged-in user routes
router.post(
  '/',
  auth(),
  validateRequest(orderValidation.createOrderSchema),
  orderController.createOrder,
);

router.get('/my-orders', auth(), orderController.getMyOrders);

router.get('/:id', auth(), orderController.getOrderById);

router.patch('/:id/cancel', auth(), orderController.cancelOrder);

// Admin-only routes
router.get('/', auth('ADMIN'), orderController.getAllOrders);

router.patch(
  '/:id/status',
  auth('ADMIN'),
  validateRequest(orderValidation.updateOrderStatusSchema),
  orderController.updateOrderStatus,
);

export const orderRoutes = router;