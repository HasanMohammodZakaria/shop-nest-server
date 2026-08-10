import prisma from '../../lib/prisma';
import AppError from '../../utils/appError';

interface CreateCategoryInput {
  name: string;
  description?: string;
}

interface UpdateCategoryInput {
  name?: string;
  description?: string;
}

const createCategory = async (payload: CreateCategoryInput) => {
  const existing = await prisma.category.findFirst({
    where: { name: payload.name, isDeleted: false },
  });

  if (existing) {
    throw new AppError(409, 'A category with this name already exists.');
  }

  return prisma.category.create({ data: payload });
};

const getAllCategories = async () => {
  return prisma.category.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: 'desc' },
  });
};

const getCategoryById = async (id: string) => {
  const category = await prisma.category.findFirst({
    where: { id, isDeleted: false },
  });

  if (!category) {
    throw new AppError(404, 'Category not found.');
  }

  return category;
};

const updateCategory = async (id: string, payload: UpdateCategoryInput) => {
  await getCategoryById(id); // throws 404 if missing/deleted

  if (payload.name) {
    const duplicate = await prisma.category.findFirst({
      where: { name: payload.name, isDeleted: false, NOT: { id } },
    });
    if (duplicate) {
      throw new AppError(409, 'A category with this name already exists.');
    }
  }

  return prisma.category.update({ where: { id }, data: payload });
};

const deleteCategory = async (id: string) => {
  await getCategoryById(id); // throws 404 if missing/deleted

  return prisma.category.update({
    where: { id },
    data: { isDeleted: true },
  });
};

export const categoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};