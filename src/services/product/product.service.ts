import { Prisma, ProductStatus } from '@prisma/client';
import prisma from '../../lib/prisma';
import AppError from '../../utils/appError';

interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  stock?: number;
  images?: string[];
  status?: ProductStatus;
  categoryId: string;
}

interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  images?: string[];
  status?: ProductStatus;
  categoryId?: string;
}

interface GetAllProductsQuery {
  page?: string;
  limit?: string;
  search?: string;
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
}

const ensureCategoryExists = async (categoryId: string) => {
  const category = await prisma.category.findFirst({
    where: { id: categoryId, isDeleted: false },
  });

  if (!category) {
    throw new AppError(404, 'Category not found.');
  }
};

const createProduct = async (payload: CreateProductInput) => {
  await ensureCategoryExists(payload.categoryId);

  return prisma.product.create({
    data: {
      name: payload.name,
      description: payload.description,
      price: payload.price,
      stock: payload.stock ?? 0,
      images: payload.images ?? [],
      status: payload.status ?? ProductStatus.ACTIVE,
      categoryId: payload.categoryId,
    },
    include: { category: true },
  });
};

const getAllProducts = async (query: GetAllProductsQuery) => {
  const {
    page = '1',
    limit = '10',
    search,
    categoryId,
    minPrice,
    maxPrice,
    status,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = query;

  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.max(Number(limit) || 10, 1);
  const skip = (pageNumber - 1) * limitNumber;

  const andConditions: Prisma.ProductWhereInput[] = [{ isDeleted: false }];

  if (search) {
    andConditions.push({
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    });
  }

  if (categoryId) {
    andConditions.push({ categoryId });
  }

  if (status) {
    andConditions.push({ status: status as ProductStatus });
  }

  if (minPrice || maxPrice) {
    andConditions.push({
      price: {
        ...(minPrice ? { gte: Number(minPrice) } : {}),
        ...(maxPrice ? { lte: Number(maxPrice) } : {}),
      },
    });
  }

  const whereConditions: Prisma.ProductWhereInput = { AND: andConditions };

  const allowedSortFields = ['createdAt', 'price', 'name', 'stock'];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
  const sortDirection = sortOrder === 'asc' ? 'asc' : 'desc';

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: whereConditions,
      skip,
      take: limitNumber,
      orderBy: { [sortField]: sortDirection },
      include: { category: true },
    }),
    prisma.product.count({ where: whereConditions }),
  ]);

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
    data: products,
  };
};

const getProductById = async (id: string) => {
  const product = await prisma.product.findFirst({
    where: { id, isDeleted: false },
    include: {
      category: true,
      reviews: {
        where: { isDeleted: false },
        include: {
          user: { select: { id: true, name: true } },
        },
      },
    },
  });

  if (!product) {
    throw new AppError(404, 'Product not found.');
  }

  return product;
};

const updateProduct = async (id: string, payload: UpdateProductInput) => {
  await getProductById(id); // throws 404 if missing/deleted

  if (payload.categoryId) {
    await ensureCategoryExists(payload.categoryId);
  }

  return prisma.product.update({
    where: { id },
    data: payload,
    include: { category: true },
  });
};

const deleteProduct = async (id: string) => {
  await getProductById(id); // throws 404 if missing/deleted

  return prisma.product.update({
    where: { id },
    data: { isDeleted: true },
  });
};

export const productService = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};