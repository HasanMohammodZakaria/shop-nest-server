import { Role } from '@prisma/client';
import prisma from '../../lib/prisma';
import AppError from '../../utils/appError';
import { hashPassword, comparePassword } from '../../lib/bcrypt';

interface GetAllUsersQuery {
  page?: string;
  limit?: string;
  search?: string;
  role?: string;
}

interface UpdateProfileInput {
  name?: string;
  phone?: string;
  address?: string;
}

interface ChangePasswordInput {
  oldPassword: string;
  newPassword: string;
}

const userPublicSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  address: true,
  role: true,
  isDeleted: true,
  createdAt: true,
  updatedAt: true,
};

// ==================== ADMIN ====================

const getAllUsers = async (query: GetAllUsersQuery) => {
  const { page = '1', limit = '10', search, role } = query;

  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.max(Number(limit) || 10, 1);
  const skip = (pageNumber - 1) * limitNumber;

  const andConditions: any[] = [{ isDeleted: false }];

  if (search) {
    andConditions.push({
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ],
    });
  }

  if (role) {
    andConditions.push({ role });
  }

  const whereConditions = { AND: andConditions };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: whereConditions,
      skip,
      take: limitNumber,
      orderBy: { createdAt: 'desc' },
      select: userPublicSelect,
    }),
    prisma.user.count({ where: whereConditions }),
  ]);

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
    data: users,
  };
};

const getUserById = async (id: string) => {
  const user = await prisma.user.findFirst({
    where: { id, isDeleted: false },
    select: {
      ...userPublicSelect,
      wishlist: {
        select: { id: true },
      },
      orders: {
        where: { isDeleted: false },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          totalAmount: true,
          status: true,
          paymentStatus: true,
          createdAt: true,
          orderItems: {
            select: {
              quantity: true,
              price: true,
              product: { select: { id: true, name: true } },
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new AppError(404, 'User not found.');
  }

  const { wishlist, orders, ...rest } = user;

  return {
    ...rest,
    wishlistCount: wishlist.length,
    totalOrders: orders.length,
    orders,
  };
};

const updateUserRole = async (id: string, role: Role) => {
  const user = await prisma.user.findFirst({
    where: { id, isDeleted: false },
  });

  if (!user) {
    throw new AppError(404, 'User not found.');
  }

  return prisma.user.update({
    where: { id },
    data: { role },
    select: userPublicSelect,
  });
};

const deleteUser = async (id: string) => {
  const user = await prisma.user.findFirst({
    where: { id, isDeleted: false },
  });

  if (!user) {
    throw new AppError(404, 'User not found.');
  }

  return prisma.user.update({
    where: { id },
    data: { isDeleted: true },
    select: userPublicSelect,
  });
};

// ==================== SELF-SERVICE ====================

const getMyProfile = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: { id: userId, isDeleted: false },
    select: userPublicSelect,
  });

  if (!user) {
    throw new AppError(404, 'User not found.');
  }

  return user;
};

const updateMyProfile = async (userId: string, payload: UpdateProfileInput) => {
  return prisma.user.update({
    where: { id: userId },
    data: payload,
    select: userPublicSelect,
  });
};

const changeMyPassword = async (userId: string, payload: ChangePasswordInput) => {
  const user = await prisma.user.findFirst({
    where: { id: userId, isDeleted: false },
  });

  if (!user) {
    throw new AppError(404, 'User not found.');
  }

  const isPasswordValid = await comparePassword(payload.oldPassword, user.password);

  if (!isPasswordValid) {
    throw new AppError(400, 'Old password is incorrect.');
  }

  const hashedPassword = await hashPassword(payload.newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return null;
};

export const userService = {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
};