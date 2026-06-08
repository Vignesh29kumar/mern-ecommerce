
@ 👗 ShopStyle — Ecommerce CRUD App

A full-stack MERN ecommerce app for managing clothes, with Admin and User (Consumer) roles.

@ Project Structure

```
ecommerce/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/
│   │   ├── auth/        # authController.js
│   │   ├── product/     # productController.js
│   │   ├── cart/        # cartController.js
│   │   └── user/        # userController.js
│   ├── middleware/       # auth.js (JWT protect + adminOnly)
│   ├── models/           # User.js, Product.js, Cart.js
│   ├── routes/           # auth.js, product.js, cart.js, user.js
│   ├── tests/            # auth.test.js, product.test.js
│   ├── validations/      # authValidation.js, productValidation.js
│   ├── server.js
│   └── package.json
│
└── frontend/
    └── src/
        ├── components/
        │   ├── common/   # Navbar, Loader, ProductCard, Pagination
        │   └── admin/    # ProductForm
        ├── context/      # AuthContext.js, CartContext.js
        ├── pages/
        │   ├── auth/     # Login.js, Register.js
        │   ├── user/     # ProductList.js, CartPage.js
        │   └── admin/    # AdminProducts.js, AdminUsers.js
        ├── services/     # api.js (all API calls)
        └── App.js
```

---

@ Setup Instructions

@ Prerequisites
- Node.js >= 16
- MongoDB (local or Atlas)

@ Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MONGO_URI and JWT_SECRET
npm install
npm run dev         # development with nodemon
npm start           # production
```

@ Frontend

```bash
cd frontend
cp .env.example .env
# Set REACT_APP_API_URL=http://localhost:5000/api
npm install
npm start
```

---

@ Environment Variables

@ Backend `.env`
| Variable    | Description                   | Example                          |
|-------------|-------------------------------|----------------------------------|
| PORT        | Server port                   | 5000                             |
| MONGO_URI   | MongoDB connection string      | mongodb://localhost:27017/ecommerce |
| JWT_SECRET  | Secret for signing JWT tokens | your_secret_key                  |
| JWT_EXPIRE  | Token expiry duration         | 7d                               |

@ Frontend `.env`
| Variable              | Description         | Example                         |
|-----------------------|---------------------|---------------------------------|
| REACT_APP_API_URL     | Backend API URL     | http://localhost:5000/api       |

---

@ Running Tests

```bash
cd backend
npm test
```

Tests cover:
- `tests/auth.test.js` — register, login, validation
- `tests/product.test.js` — CRUD, auth guards, pagination

---

@ API Endpoints

@ Auth
| Method | Endpoint            | Access  | Description       |
|--------|---------------------|---------|-------------------|
| POST   | /api/auth/register  | Public  | Register user     |
| POST   | /api/auth/login     | Public  | Login & get token |
| GET    | /api/auth/me        | Private | Get current user  |

@ Products
| Method | Endpoint            | Access       | Description          |
|--------|---------------------|--------------|----------------------|
| GET    | /api/products       | Public       | List products (paginated) |
| GET    | /api/products/:id   | Public       | Get single product   |
| POST   | /api/products       | Admin only   | Create product       |
| PUT    | /api/products/:id   | Admin only   | Update product       |
| DELETE | /api/products/:id   | Admin only   | Delete product       |

@ Cart
| Method | Endpoint            | Access  | Description               |
|--------|---------------------|---------|---------------------------|
| GET    | /api/cart           | User    | Get user's cart           |
| POST   | /api/cart           | User    | Add item to cart          |
| DELETE | /api/cart/clear     | User    | Clear entire cart         |
| DELETE | /api/cart/:productId| User    | Remove item from cart     |

@ Users
| Method | Endpoint            | Access  | Description         |
|--------|---------------------|---------|---------------------|
| GET    | /api/users          | Admin   | List all users      |
| GET    | /api/users/:id      | Admin   | Get user by ID      |
| DELETE | /api/users/:id      | Admin   | Delete user         |

---

@ AI Tools Used

| Tool            | How it was used                                               |
|-----------------|---------------------------------------------------------------|
| Claude (Anthropic) | Provided assistance with CSS styling, created test files, helped identify and fix bugs, and suggested solutions for development errors during implementation. |

---

@ Features

**Admin**
- Create, view, edit, delete products
- View all registered users
- Paginated product listing

**User (Consumer)**
- Browse and search products by name / cloth type
- Add / remove items from cart
- View cart with real-time total calculation
- Pagination on product listing

**Technical**
- JWT authentication (login, register, protected routes)
- Role-based access (admin vs user)
- Form validation (frontend + backend)
- Clean separation: controllers / routes / models / validations
- Lazy loading for all pages (React Suspense)
- Fully responsive CSS (mobile-first)
- Unit tests with Jest + Supertest
