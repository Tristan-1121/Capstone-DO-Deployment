import express from 'express';
import request from 'supertest';

// Mock the appointments model as the default export (must come before importing the module under test)
jest.mock('../models/appointments.js', () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
    find: jest.fn(),
  },
}));

jest.mock('../middleware/auth.js', () => ({
  __esModule: true,
  protect: (req, res, next) => {
    req.user = { _id: 'user1' };
    next();
  },
}));

// Import the mocked default directly
import Appointment from '../models/appointments.js';
import router from './appointment.js';

describe('appointment routes (ESM)', () => {
  let app;
  let consoleErrorSpy;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/appointments', router);
  });

  beforeEach(() => {
    // silence console.error (or use `.mockImplementation(() => {})` and assert calls)
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    jest.clearAllMocks();
  });

  describe('GET /appointments/:id', () => {
    it('returns 200 when appointment found and belongs to user', async () => {
      const appt = { _id: 'a1', patientId: { toString: () => 'user1' }, reason: 'Checkup' };
      Appointment.findById.mockResolvedValue(appt);

      const res = await request(app).get('/appointments/a1');

      expect(Appointment.findById).toHaveBeenCalledWith('a1');
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ _id: 'a1', reason: 'Checkup' });
    });

    it('returns 404 when not found', async () => {
      Appointment.findById.mockResolvedValue(null);

      const res = await request(app).get('/appointments/notfound');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Not found' });
    });

    it('returns 403 when appointment belongs to another user', async () => {
      const appt = { _id: 'a2', patientId: { toString: () => 'otherUser' } };
      Appointment.findById.mockResolvedValue(appt);

      const res = await request(app).get('/appointments/a2');

      expect(res.status).toBe(403);
      expect(res.body).toEqual({ message: 'Forbidden' });
    });

    it('returns 500 on DB error', async () => {
      Appointment.findById.mockRejectedValue(new Error('db error'));

      const res = await request(app).get('/appointments/err');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Fetch error' });
    });
  });

  describe('GET /appointments/me', () => {
    it('returns upcoming appointments when no range provided', async () => {
      const upcoming = [{ _id: 'u1', patientId: 'user1', start: new Date(Date.now() + 10000) }];
      // return an object that has sort() -> Promise<upcoming>
      Appointment.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(upcoming) });

      const res = await request(app).get('/appointments/me');

      expect(res.status).toBe(200);
      const expected = upcoming.map(a => ({ ...a, start: a.start.toISOString() }));
      expect(res.body).toEqual(expected);
    });

    it('returns past appointments when range=past', async () => {
      const past = [{ _id: 'p1', patientId: 'user1', start: new Date(Date.now() - 10000) }];
      Appointment.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(past) });

      const res = await request(app).get('/appointments/me').query({ range: 'past' });

      expect(Appointment.find).toHaveBeenCalled();
      const filterArg = Appointment.find.mock.calls[0][0];
      expect(filterArg.patientId).toBe('user1');
      expect(filterArg.start).toHaveProperty('$lt');
      expect(filterArg.start.$lt).toBeInstanceOf(Date);

      expect(res.status).toBe(200);
      const expectedPast = past.map(a => ({ ...a, start: a.start.toISOString() }));
      expect(res.body).toEqual(expectedPast);
    });

    it('returns 500 on DB error', async () => {
      // simulate query.sort() rejecting
      Appointment.find.mockReturnValue({ sort: jest.fn().mockRejectedValue(new Error('db fail')) });

      const res = await request(app).get('/appointments/me');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Fetch error' });
    });
  });
});