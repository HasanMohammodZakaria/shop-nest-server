import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { categoryRoutes } from './category.routes';
// import { userRoutes } from './user.routes';
// import { productRoutes } from './product.routes';
// import { reviewRoutes } from './review.routes';
// import { orderRoutes } from './order.routes';
// import { wishlistRoutes } from './wishlist.routes';

const router = Router();

const moduleRoutes: { path: string; route: Router }[] = [
  { path: '/auth', route: authRoutes },
  { path: '/categories', route: categoryRoutes },
  // { path: '/users', route: userRoutes },
  // { path: '/products', route: productRoutes },
  // { path: '/reviews', route: reviewRoutes },
  // { path: '/orders', route: orderRoutes },
  // { path: '/wishlist', route: wishlistRoutes },
];

moduleRoutes.forEach((r) => router.use(r.path, r.route));

export default router;