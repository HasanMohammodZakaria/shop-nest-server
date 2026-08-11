import { OrderStatus} from '@prisma/client';
import prisma from '../../lib/prisma';
import AppError from '../../utils/appError';

interface OrderItemInput {
  productId: string;
  quantity: number;
}

interface CreateOrderInput {
  shippingAddress: string;
  items: OrderItemInput[];
}

const createOrder = async (userId: string, payload: CreateOrderInput) => {
  if (!payload.items || payload.items.length === 0) {
    throw new AppError(400, 'Order must contain at least one item.');
  }

  // Transaction: validate stock, calculate total, deduct stock, create order — all or nothing
  return prisma.$transaction(async (tx) => {
    let totalAmount = 0;
    const orderItemsData: {
      productId: string;
      quantity: number;
      price: number;
    }[] = [];

    for (const item of payload.items) {
      const product = await tx.product.findFirst({
        where: { id: item.productId, isDeleted: false },
      });

      if (!product) {
        throw new AppError(404, `Product not found: ${item.productId}`);
      }

      if (product.status !== 'ACTIVE') {
        throw new AppError(400, `Product "${product.name}" is not available for purchase.`);
      }

      if (product.stock < item.quantity) {
        throw new AppError(
          400,
          `Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${item.quantity}.`,
        );
      }

      // price snapshot at the time of order
      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });

      totalAmount += product.price * item.quantity;

      // deduct stock
      await tx.product.update({
        where: { id: product.id },
        data: { stock: { decrement: item.quantity } },
      });
    }

    const order = await tx.order.create({
      data: {
        userId,
        shippingAddress: payload.shippingAddress,
        totalAmount,
        orderItems: {
          create: orderItemsData,
        },
      },
      include: {
        orderItems: {
          include: { product: true },
        },
      },
    });

    return order;
  });
};

const getMyOrders = async (userId: string) => {
  return prisma.order.findMany({
    where: { userId, isDeleted: false },
    orderBy: { createdAt: 'desc' },
    include: {
      orderItems: {
        include: { product: true },
      },
    },
  });
};

const getAllOrders = async () => {
  return prisma.order.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, name: true, email: true } },
      orderItems: {
        include: { product: true },
      },
    },
  });
};

const getOrderById = async (id: string, userId: string, userRole: string) => {
  const order = await prisma.order.findFirst({
    where: { id, isDeleted: false },
    include: {
      user: { select: { id: true, name: true, email: true } },
      orderItems: {
        include: { product: true },
      },
    },
  });

  if (!order) {
    throw new AppError(404, 'Order not found.');
  }

  if (order.userId !== userId && userRole !== 'ADMIN') {
    throw new AppError(403, 'You do not have permission to view this order.');
  }

  return order;
};

const updateOrderStatus = async (id: string, status: OrderStatus) => {
  const order = await prisma.order.findFirst({
    where: { id, isDeleted: false },
  });

  if (!order) {
    throw new AppError(404, 'Order not found.');
  }

  if (order.status === 'CANCELLED' || order.status === 'DELIVERED') {
    throw new AppError(400, `Cannot change status of a ${order.status.toLowerCase()} order.`);
  }

  return prisma.order.update({
    where: { id },
    data: { status },
    include: {
      orderItems: { include: { product: true } },
    },
  });
};

const cancelOrder = async (id: string, userId: string, userRole: string) => {
  const order = await prisma.order.findFirst({
    where: { id, isDeleted: false },
  });

  if (!order) {
    throw new AppError(404, 'Order not found.');
  }

  if (order.userId !== userId && userRole !== 'ADMIN') {
    throw new AppError(403, 'You do not have permission to cancel this order.');
  }

  if (order.status !== 'PENDING') {
    throw new AppError(400, 'Only pending orders can be cancelled.');
  }

  // Transaction: restore stock + mark order cancelled
  return prisma.$transaction(async (tx) => {
    const orderItems = await tx.orderItem.findMany({ where: { orderId: id } });

    for (const item of orderItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }

    return tx.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: {
        orderItems: { include: { product: true } },
      },
    });
  });
};

export const orderService = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
};