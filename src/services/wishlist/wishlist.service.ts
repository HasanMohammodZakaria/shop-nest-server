import prisma from '../../lib/prisma';
import AppError from '../../utils/appError';

const ensureProductExists = async (productId: string) => {
  const product = await prisma.product.findFirst({
    where: { id: productId, isDeleted: false },
  });

  if (!product) {
    throw new AppError(404, 'Product not found.');
  }
};

const addToWishlist = async (userId: string, productId: string) => {
  await ensureProductExists(productId);

  const existing = await prisma.wishlist.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existing) {
    throw new AppError(409, 'This product is already in your wishlist.');
  }

  return prisma.wishlist.create({
    data: { userId, productId },
    include: { product: true },
  });
};

const getMyWishlist = async (userId: string) => {
  return prisma.wishlist.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { product: true },
  });
};

const removeFromWishlist = async (userId: string, productId: string) => {
  const existing = await prisma.wishlist.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (!existing) {
    throw new AppError(404, 'This product is not in your wishlist.');
  }

  return prisma.wishlist.delete({
    where: { userId_productId: { userId, productId } },
  });
};

export const wishlistService = {
  addToWishlist,
  getMyWishlist,
  removeFromWishlist,
};