import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { wishlistService } from './wishlist.service';

const addToWishlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { productId } = req.body;
  const result = await wishlistService.addToWishlist(userId, productId);
  sendResponse(res, 201, {
    success: true,
    message: 'Product added to wishlist successfully',
    data: result,
  });
});

const getMyWishlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await wishlistService.getMyWishlist(userId);
  sendResponse(res, 200, {
    success: true,
    message: 'Wishlist retrieved successfully',
    data: result,
  });
});

const removeFromWishlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { productId } = req.params;
  const result = await wishlistService.removeFromWishlist(userId, productId as string);
  sendResponse(res, 200, {
    success: true,
    message: 'Product removed from wishlist successfully',
    data: result,
  });
});

export const wishlistController = {
  addToWishlist,
  getMyWishlist,
  removeFromWishlist,
};