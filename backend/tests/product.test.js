const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Product = require('../models/Product');

let adminToken;
let userToken;
let createdProductId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce_test');

  // Create admin user
  const adminRes = await request(app).post('/api/auth/register').send({
    name: 'Admin',
    email: 'admin_test@example.com',
    password: 'password123',
    role: 'admin',
  });
  adminToken = adminRes.body.token;

  // Create regular user
  const userRes = await request(app).post('/api/auth/register').send({
    name: 'User',
    email: 'user_test@example.com',
    password: 'password123',
  });
  userToken = userRes.body.token;
});

afterAll(async () => {
  await Product.deleteMany({ title: /Test Product/ });
  await User.deleteMany({ email: /test@example.com/ });
  await mongoose.connection.close();
});

describe('Product Routes', () => {
  const testProduct = {
    title: 'Test Product Shirt',
    description: 'A nice test shirt',
    rate: 999,
    discount: 10,
    clothType: 'shirt',
    stock: 50,
  };

  describe('POST /api/products', () => {
    it('should allow admin to create a product', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(testProduct);
      expect(res.statusCode).toBe(201);
      expect(res.body.title).toBe(testProduct.title);
      createdProductId = res.body._id;
    });

    it('should deny regular user from creating a product', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send(testProduct);
      expect(res.statusCode).toBe(403);
    });

    it('should fail without auth token', async () => {
      const res = await request(app).post('/api/products').send(testProduct);
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/products', () => {
    it('should get all products', async () => {
      const res = await request(app).get('/api/products');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('products');
      expect(Array.isArray(res.body.products)).toBe(true);
    });

    it('should support pagination', async () => {
      const res = await request(app).get('/api/products?page=1&limit=5');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('totalPages');
    });
  });

  describe('GET /api/products/:id', () => {
    it('should get a product by id', async () => {
      const res = await request(app).get(`/api/products/${createdProductId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body._id).toBe(createdProductId);
    });

    it('should return 404 for non-existent product', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/products/${fakeId}`);
      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should allow admin to update a product', async () => {
      const res = await request(app)
        .put(`/api/products/${createdProductId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ ...testProduct, title: 'Test Product Updated' });
      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe('Test Product Updated');
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should allow admin to delete a product', async () => {
      const res = await request(app)
        .delete(`/api/products/${createdProductId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Product deleted successfully');
    });
  });
});
