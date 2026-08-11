import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { orderService } from './order.service';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await orderService.createOrder(userId, req.body);
  sendResponse(res, 201, {
    success: true,
    message: 'Order placed successfully',
    data: result,
  });
});

const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await orderService.getMyOrders(userId);
  sendResponse(res, 200, {
    success: true,
    message: 'Your orders retrieved successfully',
    data: result,
  });
});

const getAllOrders = catchAsync(async (_req: Request, res: Response) => {
  const result = await orderService.getAllOrders();
  sendResponse(res, 200, {
    success: true,
    message: 'All orders retrieved successfully',
    data: result,
  });
});

const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.userId;
  const userRole = req.user!.role;
  const result = await orderService.getOrderById(id as string, userId, userRole);
  sendResponse(res, 200, {
    success: true,
    message: 'Order retrieved successfully',
    data: result,
  });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await orderService.updateOrderStatus(id as string, status);
  sendResponse(res, 200, {
    success: true,
    message: 'Order status updated successfully',
    data: result,
  });
});

const cancelOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.userId;
  const userRole = req.user!.role;
  const result = await orderService.cancelOrder(id as string, userId, userRole);
  sendResponse(res, 200, {
    success: true,
    message: 'Order cancelled successfully',
    data: result,
  });
});

export const orderController = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
};