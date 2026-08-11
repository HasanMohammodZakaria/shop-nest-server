import prisma from '../../lib/prisma';
import AppError from '../../utils/appError';

interface CreateReviewInput {
  rating: number;
  comment?: string;
  productId: string;
}

interface UpdateReviewInput {
  rating?: number;
  comment?: string;
}

const ensureProductExists = async (productId: string) => {
  const product = await prisma.product.findFirst({
    where: { id: productId, isDeleted: false },
  });

  if (!product) {
    throw new AppError(404, 'Product not found.');
  }
};

const createReview = async (userId: string, payload: CreateReviewInput) => {
  await ensureProductExists(payload.productId);

  const existing = await prisma.review.findFirst({
    where: { userId, productId: payload.productId, isDeleted: false },
  });

  if (existing) {
    throw new AppError(409, 'You have already reviewed this product.');
  }

  return prisma.review.create({
    data: {
      rating: payload.rating,
      comment: payload.comment,
      userId,
      productId: payload.productId,
    },
    include: {
      user: { select: { id: true, name: true } },
    },
  });
};

const getReviewsByProduct = async (productId: string) => {
  await ensureProductExists(productId);

  return prisma.review.findMany({
    where: { productId, isDeleted: false },
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, name: true } },
    },
  });
};

const getReviewById = async (id: string) => {
  const review = await prisma.review.findFirst({
    where: { id, isDeleted: false },
    include: {
      user: { select: { id: true, name: true } },
      product: { select: { id: true, name: true } },
    },
  });

  if (!review) {
    throw new AppError(404, 'Review not found.');
  }

  return review;
};

const updateReview = async (
  id: string,
  userId: string,
  userRole: string,
  payload: UpdateReviewInput,
) => {
  const review = await getReviewById(id);

  if (review.userId !== userId && userRole !== 'ADMIN') {
    throw new AppError(403, 'You do not have permission to update this review.');
  }

  return prisma.review.update({
    where: { id },
    data: payload,
    include: {
      user: { select: { id: true, name: true } },
    },
  });
};

const deleteReview = async (id: string, userId: string, userRole: string) => {
  const review = await getReviewById(id);

  if (review.userId !== userId && userRole !== 'ADMIN') {
    throw new AppError(403, 'You do not have permission to delete this review.');
  }

  return prisma.review.update({
    where: { id },
    data: { isDeleted: true },
  });
};

export const reviewService = {
  createReview,
  getReviewsByProduct,
  getReviewById,
  updateReview,
  deleteReview,
};