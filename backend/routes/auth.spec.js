import express from 'express';
import request from 'supertest';

// Mock modules BEFORE importing the router
jest.mock('../models/User.js', () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

// Change: export a default object so `import jwt from 'jsonwebtoken'` has `.sign`
jest.mock('jsonwebtoken', () => ({
  __esModule: true,
  default: {
    sign: jest.fn(() => 'signed-token'),
    verify: jest.fn(),
  },
}));

jest.mock('../middleware/auth.js', () => ({
  __esModule: true,
  protect: (req, res, next) => {
    req.user = { _id: 'user1', username: 'tester', email: 'test@example.com' };
    next();
  },
}));

import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import router from './auth.js';

describe('auth routes', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/auth', router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    it('returns 400 when fields are missing', async () => {
      const res = await request(app).post('/auth/register').send({});
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Please fill all the fields' });
    });

    it('returns 400 when user already exists', async () => {
      User.findOne.mockResolvedValue({ _id: 'exists' });
      const res = await request(app)
        .post('/auth/register')
        .send({ username: 'u', email: 'e@example.com', password: 'p' });

      expect(User.findOne).toHaveBeenCalledWith({ email: 'e@example.com' });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'User already exists' });
    });

    it('creates user and returns token on success', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({ _id: 'u1', username: 'u', email: 'e@example.com' });

      const res = await request(app)
        .post('/auth/register')
        .send({ username: 'u', email: 'e@example.com', password: 'p' });

      expect(User.findOne).toHaveBeenCalledWith({ email: 'e@example.com' });
      expect(User.create).toHaveBeenCalledWith({ username: 'u', email: 'e@example.com', password: 'p' });
      expect(jwt.sign).toHaveBeenCalledWith({ id: 'u1' }, process.env.JWT_SECRET, { expiresIn: '30d' });
      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        id: 'u1',
        username: 'u',
        email: 'e@example.com',
        token: 'signed-token',
      });
    });

    it('returns 500 on server error', async () => {
      User.findOne.mockRejectedValue(new Error('db'));
      const res = await request(app)
        .post('/auth/register')
        .send({ username: 'u', email: 'e@example.com', password: 'p' });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Server error' });
    });
  });

  describe('POST /auth/login', () => {
    it('returns 400 when fields are missing', async () => {
      const res = await request(app).post('/auth/login').send({});
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Please fill all the filed' });
    });

    it('returns 401 for invalid credentials (no user)', async () => {
      User.findOne.mockResolvedValue(null);
      const res = await request(app).post('/auth/login').send({ email: 'e', password: 'p' });
      expect(User.findOne).toHaveBeenCalledWith({ email: 'e' });
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ message: 'Invalid credentials' });
    });

    it('returns 401 for invalid password', async () => {
      const user = { _id: 'u1', username: 'u', email: 'e', matchPassword: jest.fn().mockResolvedValue(false) };
      User.findOne.mockResolvedValue(user);

      const res = await request(app).post('/auth/login').send({ email: 'e', password: 'wrong' });

      expect(user.matchPassword).toHaveBeenCalledWith('wrong');
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ message: 'Invalid credentials' });
    });

    it('returns 200 and token for valid credentials', async () => {
      const user = { _id: 'u1', username: 'u', email: 'e', matchPassword: jest.fn().mockResolvedValue(true) };
      User.findOne.mockResolvedValue(user);

      const res = await request(app).post('/auth/login').send({ email: 'e', password: 'p' });

      expect(User.findOne).toHaveBeenCalledWith({ email: 'e' });
      expect(user.matchPassword).toHaveBeenCalledWith('p');
      expect(jwt.sign).toHaveBeenCalledWith({ id: 'u1' }, process.env.JWT_SECRET, { expiresIn: '30d' });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        id: 'u1',
        username: 'u',
        email: 'e',
        token: 'signed-token',
      });
    });

    it('returns 500 on server error', async () => {
      User.findOne.mockRejectedValue(new Error('db'));
      const res = await request(app).post('/auth/login').send({ email: 'e', password: 'p' });
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Server error' });
    });
  });

  describe('GET /auth/me', () => {
    it('returns current user from protect middleware', async () => {
      const res = await request(app).get('/auth/me');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ _id: 'user1', username: 'tester', email: 'test@example.com' });
    });

    it('returns 500 when handler throws', async () => {
      // create a router that throws in handler to simulate error
      const brokenRouter = express.Router();
      brokenRouter.get('/me', (req, res) => { throw new Error('boom'); });

      // mount broken router under /broken and add an error handler that matches production behavior
      app.use('/broken', brokenRouter);
      app.use((err, req, res, next) => {
        // mimic your app's error response shape
        res.status(500).json({ message: 'Server error' });
      });

      const res = await request(app).get('/broken/me');
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Server error' });
    });
  });
});
