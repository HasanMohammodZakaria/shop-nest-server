import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { reviewService } from './review.service';

const createReview = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await reviewService.createReview(userId, req.body);
  sendResponse(res, 201, {
    success: true,
    message: 'Review submitted successfully',
    data: result,
  });
});

const getReviewsByProduct = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const result = await reviewService.getReviewsByProduct(productId as string);
  sendResponse(res, 200, {
    success: true,
    message: 'Reviews retrieved successfully',
    data: result,
  });
});

const getReviewById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await reviewService.getReviewById(id as string);
  sendResponse(res, 200, {
    success: true,
    message: 'Review retrieved successfully',
    data: result,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.userId;
  const userRole = req.user!.role;
  const result = await reviewService.updateReview(id as string, userId, userRole, req.body);
  sendResponse(res, 200, {
    success: true,
    message: 'Review updated successfully',
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.userId;
  const userRole = req.user!.role;
  const result = await reviewService.deleteReview(id as string, userId, userRole);
  sendResponse(res, 200, {
    success: true,
    message: 'Review deleted successfully',
    data: result,
  });
});

export const reviewController = {
  createReview,
  getReviewsByProduct,
  getReviewById,
  updateReview,
  deleteReview,
};