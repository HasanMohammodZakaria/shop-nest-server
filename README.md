# ShopNest Backend API Documentation

A production-ready REST API for an e-commerce platform, built with Express.js, TypeScript, Prisma ORM, and PostgreSQL.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL (hosted on Neon)
- **ORM:** Prisma
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **Validation:** Zod

## Project Structure

```
server/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── lib/
│   ├── middlewares/
│   ├── routes/
│   ├── services/
│   │   ├── auth/
│   │   ├── user/
│   │   ├── category/
│   │   ├── product/
│   │   ├── review/
│   │   ├── order/
│   │   └── wishlist/
│   └── types/
├── .env.example
└── package.json
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/shopnest-backend.git
cd shopnest-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Neon) |
| `PORT` | Port the server runs on (default: 5000) |
| `CLIENT_URL` | Frontend URL, used for CORS |
| `JWT_SECRET` | Secret key used to sign JWTs |
| `JWT_EXPIRES_IN` | Token expiry duration (e.g. `7d`) |

### 4. Run database migrations

```bash
npx prisma generate
npx prisma migrate dev
```

### 5. Start the development server

```bash
npm run dev
```

Server runs at `http://localhost:5000`.

---

## API Response Format

All endpoints return a consistent response shape:

```json
{
  "success": true,
  "message": "Description of what happened",
  "data": {}
}
```

Paginated list endpoints wrap data as:

```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": {
    "meta": { "page": 1, "limit": 10, "total": 45, "totalPages": 5 },
    "data": [ /* array of items */ ]
  }
}
```

## Authentication

Protected routes require a JWT sent in the `Authorization` header:

```
Authorization: Bearer <token>
```

---

# API Endpoints

## Auth

### Register a new user

| | |
|---|---|
| **Endpoint** | `/api/auth/register` |
| **Method** | `POST` |
| **Auth Required** | No |

**Request Body**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "phone": "01710000000",
  "address": "Dhaka, Bangladesh"
}
```

**Response — 201 Created**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOi...",
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER"
    }
  }
}
```

**Status Codes:** `201` Created · `400` Validation error · `409` Email already exists

---

### Login

| | |
|---|---|
| **Endpoint** | `/api/auth/login` |
| **Method** | `POST` |
| **Auth Required** | No |

**Request Body**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response — 200 OK**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOi...",
    "user": { "id": "uuid", "name": "John Doe", "email": "john@example.com", "role": "USER" }
  }
}
```

**Status Codes:** `200` OK · `401` Invalid credentials

---

## Users

### Get my profile

| | |
|---|---|
| **Endpoint** | `/api/users/me` |
| **Method** | `GET` |
| **Auth Required** | Yes (any logged-in user) |

**Response — 200 OK** — returns the current user's profile.

---

### Update my profile

| | |
|---|---|
| **Endpoint** | `/api/users/me` |
| **Method** | `PATCH` |
| **Auth Required** | Yes |

**Request Body** (all fields optional)
```json
{ "name": "New Name", "phone": "01710000001", "address": "New address" }
```

**Status Codes:** `200` OK · `401` Unauthorized

---

### Change my password

| | |
|---|---|
| **Endpoint** | `/api/users/me/password` |
| **Method** | `PATCH` |
| **Auth Required** | Yes |

**Request Body**
```json
{ "oldPassword": "SecurePass123", "newPassword": "NewSecurePass456" }
```

**Status Codes:** `200` OK · `400` Wrong old password · `401` Unauthorized

---

### Get all users (Admin)

| | |
|---|---|
| **Endpoint** | `/api/users` |
| **Method** | `GET` |
| **Auth Required** | Yes (ADMIN only) |

**Status Codes:** `200` OK · `403` Forbidden (non-admin)

---

### Get user by ID (Admin)

| | |
|---|---|
| **Endpoint** | `/api/users/:id` |
| **Method** | `GET` |
| **Auth Required** | Yes (ADMIN only) |

---

### Update user role (Admin)

| | |
|---|---|
| **Endpoint** | `/api/users/:id/role` |
| **Method** | `PATCH` |
| **Auth Required** | Yes (ADMIN only) |

**Request Body**
```json
{ "role": "ADMIN" }
```

---

### Delete user — soft delete (Admin)

| | |
|---|---|
| **Endpoint** | `/api/users/:id` |
| **Method** | `DELETE` |
| **Auth Required** | Yes (ADMIN only) |

---

## Categories

### Create category (Admin)

| | |
|---|---|
| **Endpoint** | `/api/categories` |
| **Method** | `POST` |
| **Auth Required** | Yes (ADMIN only) |

**Request Body**
```json
{ "name": "Electronics", "description": "Electronic gadgets and devices" }
```

**Status Codes:** `201` Created · `403` Forbidden · `409` Name already exists

---

### Get all categories

| | |
|---|---|
| **Endpoint** | `/api/categories` |
| **Method** | `GET` |
| **Auth Required** | No |

---

### Get category by ID

| | |
|---|---|
| **Endpoint** | `/api/categories/:id` |
| **Method** | `GET` |
| **Auth Required** | No |

**Status Codes:** `200` OK · `404` Not found

---

### Update category (Admin)

| | |
|---|---|
| **Endpoint** | `/api/categories/:id` |
| **Method** | `PATCH` |
| **Auth Required** | Yes (ADMIN only) |

---

### Delete category — soft delete (Admin)

| | |
|---|---|
| **Endpoint** | `/api/categories/:id` |
| **Method** | `DELETE` |
| **Auth Required** | Yes (ADMIN only) |

---

## Products

### Create product (Admin)

| | |
|---|---|
| **Endpoint** | `/api/products` |
| **Method** | `POST` |
| **Auth Required** | Yes (ADMIN only) |

**Request Body**
```json
{
  "name": "Wireless Headphones",
  "description": "Noise-cancelling over-ear headphones",
  "price": 89.99,
  "stock": 50,
  "images": ["https://example.com/image1.jpg"],
  "categoryId": "uuid"
}
```

**Status Codes:** `201` Created · `403` Forbidden · `404` Category not found

---

### Get all products (with filters, search, pagination)

| | |
|---|---|
| **Endpoint** | `/api/products` |
| **Method** | `GET` |
| **Auth Required** | No |

**Query Parameters**

| Param | Type | Description |
|---|---|---|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |
| `search` | string | Search by name/description |
| `categoryId` | string | Filter by category |
| `minPrice` / `maxPrice` | number | Price range filter |
| `status` | string | `ACTIVE` / `INACTIVE` / `OUT_OF_STOCK` |
| `sortBy` | string | `createdAt` / `price` / `name` / `stock` |
| `sortOrder` | string | `asc` / `desc` |

Example: `GET /api/products?search=phone&minPrice=100&maxPrice=5000&sortBy=price&sortOrder=asc`

---

### Get product by ID

| | |
|---|---|
| **Endpoint** | `/api/products/:id` |
| **Method** | `GET` |
| **Auth Required** | No |

Returns the product with its category and reviews included.

**Status Codes:** `200` OK · `404` Not found

---

### Update product (Admin)

| | |
|---|---|
| **Endpoint** | `/api/products/:id` |
| **Method** | `PATCH` |
| **Auth Required** | Yes (ADMIN only) |

---

### Delete product — soft delete (Admin)

| | |
|---|---|
| **Endpoint** | `/api/products/:id` |
| **Method** | `DELETE` |
| **Auth Required** | Yes (ADMIN only) |

---

## Reviews

### Create a review

| | |
|---|---|
| **Endpoint** | `/api/reviews` |
| **Method** | `POST` |
| **Auth Required** | Yes (any logged-in user) |

**Request Body**
```json
{ "productId": "uuid", "rating": 5, "comment": "Great product!" }
```

**Status Codes:** `201` Created · `404` Product not found · `409` Already reviewed this product

---

### Get reviews for a product

| | |
|---|---|
| **Endpoint** | `/api/reviews/product/:productId` |
| **Method** | `GET` |
| **Auth Required** | No |

---

### Get recent reviews (across all products)

| | |
|---|---|
| **Endpoint** | `/api/reviews/recent` |
| **Method** | `GET` |
| **Auth Required** | No |

**Query Parameters:** `limit` (default: 6)

---

### Get review by ID

| | |
|---|---|
| **Endpoint** | `/api/reviews/:id` |
| **Method** | `GET` |
| **Auth Required** | No |

---

### Update review

| | |
|---|---|
| **Endpoint** | `/api/reviews/:id` |
| **Method** | `PATCH` |
| **Auth Required** | Yes (owner or ADMIN) |

**Status Codes:** `200` OK · `403` Forbidden (not owner/admin)

---

### Delete review — soft delete

| | |
|---|---|
| **Endpoint** | `/api/reviews/:id` |
| **Method** | `DELETE` |
| **Auth Required** | Yes (owner or ADMIN) |

---

## Orders

### Create order

| | |
|---|---|
| **Endpoint** | `/api/orders` |
| **Method** | `POST` |
| **Auth Required** | Yes |

**Request Body**
```json
{
  "shippingAddress": "John Doe, 01710000000, House 12, Road 3, Dhaka, 1207, Bangladesh",
  "items": [
    { "productId": "uuid", "quantity": 2 },
    { "productId": "uuid", "quantity": 1 }
  ]
}
```

**Response — 201 Created**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "id": "uuid",
    "totalAmount": 249.97,
    "status": "PENDING",
    "paymentStatus": "UNPAID",
    "orderItems": []
  }
}
```

---

### Get my orders

| | |
|---|---|
| **Endpoint** | `/api/orders/my-orders` |
| **Method** | `GET` |
| **Auth Required** | Yes |

---

### Get all orders (Admin)

| | |
|---|---|
| **Endpoint** | `/api/orders` |
| **Method** | `GET` |
| **Auth Required** | Yes (ADMIN only) |

---

### Get order by ID

| | |
|---|---|
| **Endpoint** | `/api/orders/:id` |
| **Method** | `GET` |
| **Auth Required** | Yes (owner or ADMIN) |

---

### Update order status (Admin)

| | |
|---|---|
| **Endpoint** | `/api/orders/:id/status` |
| **Method** | `PATCH` |
| **Auth Required** | Yes (ADMIN only) |

**Request Body**
```json
{ "status": "CONFIRMED" }
```

Valid values: `PENDING`, `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED`

---

### Cancel order

| | |
|---|---|
| **Endpoint** | `/api/orders/:id/cancel` |
| **Method** | `PATCH` |
| **Auth Required** | Yes (owner) |

Only allowed while the order is still `PENDING`.

---

## Wishlist

### Add product to wishlist

| | |
|---|---|
| **Endpoint** | `/api/wishlist` |
| **Method** | `POST` |
| **Auth Required** | Yes |

**Request Body**
```json
{ "productId": "uuid" }
```

**Status Codes:** `201` Created · `409` Already in wishlist

---

### Get my wishlist

| | |
|---|---|
| **Endpoint** | `/api/wishlist` |
| **Method** | `GET` |
| **Auth Required** | Yes |

---

### Remove product from wishlist

| | |
|---|---|
| **Endpoint** | `/api/wishlist/:productId` |
| **Method** | `DELETE` |
| **Auth Required** | Yes |

---

## Enums Reference

| Enum | Values |
|---|---|
| `Role` | `ADMIN`, `USER` |
| `ProductStatus` | `ACTIVE`, `INACTIVE`, `OUT_OF_STOCK` |
| `OrderStatus` | `PENDING`, `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED` |
| `PaymentStatus` | `UNPAID`, `PAID`, `FAILED`, `REFUNDED` |

---

## Live Links

- **Live Backend API:** https://shop-nest-server-2ppf.onrender.com
- **Live Frontend:** https://shopnest-liart-zeta.vercel.app
- **GitHub Repository (Frontend ):** https://github.com/HasanMohammodZakaria/shop-nest-client
- **GitHub Repository (Backend):** https://github.com/HasanMohammodZakaria/shop-nest-server