import express from 'express';
import request from 'supertest';

// mocks must be registered before importing the router
jest.mock('../models/CallBack.js', () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

jest.mock('../middleware/auth.js', () => ({
  __esModule: true,
  protect: (req, res, next) => {
    req.user = { id: 'user1' };
    next();
  },
}));

import CallBack from '../models/CallBack.js';
import router from './callBack.js';

describe('Callback routes', () => {
  let app;
  let consoleErrSpy;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/callbacks', router);
  });

  beforeEach(() => {
    consoleErrSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    consoleErrSpy.mockRestore();
  });

  describe('POST /api/callbacks', () => {
    it('returns 400 when Phone/Email or Reason missing', async () => {
      const res = await request(app).post('/api/callbacks').send({});
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Phone or Email, and Reason are required' });
    });

    it('prefers phone when provided and returns created payload with contactUsed=phone', async () => {
      const created = {
        _id: 'c1',
        patientId: 'user1',
        Phone: '123456',
        Email: null,
        Reason: 'Need callback',
        toObject: () => ({ _id: 'c1', patientId: 'user1', Phone: '123456', Email: null, Reason: 'Need callback' }),
      };
      CallBack.create.mockResolvedValue(created);

      const res = await request(app)
        .post('/api/callbacks')
        .send({ Phone: '123456', Reason: 'Need callback' });

      expect(CallBack.create).toHaveBeenCalledWith({
        patientId: 'user1',
        Phone: '123456',
        Email: null,
        Reason: 'Need callback',
      });
      expect(res.status).toBe(201);
      expect(res.body).toEqual({ ...created.toObject(), contactUsed: 'phone' });
    });

    it('falls back to email when phone missing and sets contactUsed=email', async () => {
      const created = {
        _id: 'c2',
        patientId: 'user1',
        Phone: null,
        Email: 'a@b.com',
        Reason: 'Please call me',
        toObject: () => ({ _id: 'c2', patientId: 'user1', Phone: null, Email: 'a@b.com', Reason: 'Please call me' }),
      };
      CallBack.create.mockResolvedValue(created);

      const res = await request(app)
        .post('/api/callbacks')
        .send({ Email: 'a@b.com', Reason: 'Please call me' });

      expect(CallBack.create).toHaveBeenCalledWith({
        patientId: 'user1',
        Phone: null,
        Email: 'a@b.com',
        Reason: 'Please call me',
      });
      expect(res.status).toBe(201);
      expect(res.body).toEqual({ ...created.toObject(), contactUsed: 'email' });
    });

    it('returns 500 on DB error', async () => {
      CallBack.create.mockRejectedValue(new Error('db fail'));
      const res = await request(app).post('/api/callbacks').send({ Phone: '1', Reason: 'r' });
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Server error creating callback request' });
      expect(consoleErrSpy).toHaveBeenCalled();
    });
  });

  describe('DELETE /api/callbacks/:id', () => {
    it('deletes and returns success message when found', async () => {
      CallBack.findByIdAndDelete.mockResolvedValue({ _id: 'c1' });
      const res = await request(app).delete('/api/callbacks/c1');
      expect(CallBack.findByIdAndDelete).toHaveBeenCalledWith('c1');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Callback request deleted successfully' });
    });

    it('returns 404 when not found', async () => {
      CallBack.findByIdAndDelete.mockResolvedValue(null);
      const res = await request(app).delete('/api/callbacks/missing');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Callback request not found' });
    });

    it('returns 500 on DB error', async () => {
      CallBack.findByIdAndDelete.mockRejectedValue(new Error('db fail'));
      const res = await request(app).delete('/api/callbacks/err');
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Server error deleting callback request' });
      expect(consoleErrSpy).toHaveBeenCalled();
    });
  });

  describe('PUT /api/callbacks/:id/status', () => {
    it('updates status and returns updated document when found', async () => {
      const updated = { _id: 'c1', Status: 'completed' };
      CallBack.findByIdAndUpdate.mockResolvedValue(updated);

      const res = await request(app).put('/api/callbacks/c1/status').send({ Status: 'completed' });

      expect(CallBack.findByIdAndUpdate).toHaveBeenCalledWith('c1', { Status: 'completed' }, { new: true });
      expect(res.status).toBe(200);
      expect(res.body).toEqual(updated);
    });

    it('returns 404 when callback not found', async () => {
      CallBack.findByIdAndUpdate.mockResolvedValue(null);
      const res = await request(app).put('/api/callbacks/missing/status').send({ Status: 'x' });
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Callback request not found' });
    });

    it('returns 500 on DB error', async () => {
      CallBack.findByIdAndUpdate.mockRejectedValue(new Error('db fail'));
      const res = await request(app).put('/api/callbacks/err/status').send({ Status: 'x' });
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Server error updating callback status' });
      expect(consoleErrSpy).toHaveBeenCalled();
    });
  });
});