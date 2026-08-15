import prisma from '../../lib/prisma';
import { hashPassword, comparePassword } from '../../lib/bcrypt';
import { generateToken } from '../../lib/jwt';
import AppError from '../../utils/appError';

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  image?: string;
  phone?: string;
  address?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

const registerUser = async (payload: RegisterInput) => {
  const existingUser = await prisma.user.findFirst({
    where: { email: payload.email, isDeleted: false },
  });

  if (existingUser) {
    throw new AppError(409, 'A user with this email already exists.');
  }

  const hashedPassword = await hashPassword(payload.password);

  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      image: payload.image,
      phone: payload.phone,
      address: payload.address,
    },
  });

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const { password, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

const loginUser = async (payload: LoginInput) => {
  const user = await prisma.user.findFirst({
    where: { email: payload.email, isDeleted: false },
  });

  if (!user) {
    throw new AppError(401, 'Invalid email or password.');
  }

  const isPasswordValid = await comparePassword(payload.password, user.password);

  if (!isPasswordValid) {
    throw new AppError(401, 'Invalid email or password.');
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const { password, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

export const authService = {
  registerUser,
  loginUser,
};