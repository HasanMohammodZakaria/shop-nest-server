import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { userService } from './user.service';

// ==================== ADMIN ====================

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getAllUsers(req.query);
  sendResponse(res, 200, {
    success: true,
    message: 'Users retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userService.getUserById(id as string);
  sendResponse(res, 200, {
    success: true,
    message: 'User retrieved successfully',
    data: result,
  });
});

const updateUserRole = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;
  const result = await userService.updateUserRole(id as string, role);
  sendResponse(res, 200, {
    success: true,
    message: 'User role updated successfully',
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userService.deleteUser(id as string);
  sendResponse(res, 200, {
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});

// ==================== SELF-SERVICE ====================

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await userService.getMyProfile(userId);
  sendResponse(res, 200, {
    success: true,
    message: 'Profile retrieved successfully',
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await userService.updateMyProfile(userId, req.body);
  sendResponse(res, 200, {
    success: true,
    message: 'Profile updated successfully',
    data: result,
  });
});

const changeMyPassword = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  await userService.changeMyPassword(userId, req.body);
  sendResponse(res, 200, {
    success: true,
    message: 'Password changed successfully',
    data: null,
  });
});

export const userController = {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
};