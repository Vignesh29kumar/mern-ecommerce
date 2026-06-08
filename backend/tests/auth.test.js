const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/ecommerce_test');
});

afterAll(async () => {
  await User.deleteMany({ email: /test/ });
  await mongoose.connection.close();
});

describe('Auth Routes', () => {
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app).post('/api/auth/register').send(testUser);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.email).toBe(testUser.email);
    });

    it('should not register with duplicate email', async () => {
      const res = await request(app).post('/api/auth/register').send(testUser);
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Email already registered');
    });

    it('should fail with invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...testUser, email: 'notanemail' });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it('should fail with short password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...testUser, email: 'test2@example.com', password: '123' });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should fail with wrong password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: 'wrongpassword',
      });
      expect(res.statusCode).toBe(401);
    });

    it('should fail with non-existent email', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'nobody@example.com',
        password: 'password123',
      });
      expect(res.statusCode).toBe(401);
    });
  });
});
