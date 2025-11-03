import express from 'express';
import request from 'supertest';

jest.mock('../models/Patient.js', () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
    findOneAndUpdate: jest.fn(),
  },
}));

jest.mock('../middleware/auth.js', () => ({
  __esModule: true,
  protect: (req, res, next) => {
    req.user = { email: 'test@example.com', username: 'tester', _id: 'user1' };
    next();
  },
}));

import Patient from '../models/Patient.js';
import router from './patient.js';

describe('patient routes', () => {
  let app;
  let consoleErrSpy;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/patients', router);
  });

  beforeEach(() => {
    consoleErrSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    consoleErrSpy.mockRestore();
  });

  describe('GET /api/patients/me', () => {
    it('returns existing patient when found', async () => {
      const existing = { Email: 'test@example.com', Name: 'tester', Age: 25 };
      Patient.findOne.mockResolvedValue(existing);

      const res = await request(app).get('/api/patients/me');

      expect(Patient.findOne).toHaveBeenCalledWith({ Email: 'test@example.com' });
      expect(res.status).toBe(200);
      expect(res.body).toEqual(existing);
    });

    it('creates and returns a new patient when none exists', async () => {
      Patient.findOne.mockResolvedValue(null);
      const created = {
        Email: 'test@example.com',
        Name: 'tester',
        Age: 0,
        Weight: 0,
        Height: 0,
        Sex: '',
        Phone: '',
        Address: '',
        City: '',
        State: '',
        Zip: '',
        MedHist: [],
        Prescriptions: [],
        Allergies: [],
      };
      Patient.create.mockResolvedValue(created);

      const res = await request(app).get('/api/patients/me');

      expect(Patient.findOne).toHaveBeenCalledWith({ Email: 'test@example.com' });
      expect(Patient.create).toHaveBeenCalledWith(expect.objectContaining({
        Email: 'test@example.com',
        Name: 'tester',
        MedHist: expect.any(Array),
        Prescriptions: expect.any(Array),
        Allergies: expect.any(Array),
      }));
      expect(res.status).toBe(200);
      expect(res.body).toEqual(created);
    });

    it('returns 500 when db throws', async () => {
      Patient.findOne.mockRejectedValue(new Error('db fail'));

      const res = await request(app).get('/api/patients/me');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Server error fetching patient data' });
      expect(consoleErrSpy).toHaveBeenCalled();
    });
  });

  describe('PUT /api/patients/me', () => {
    it('updates and returns the patient', async () => {
      const updates = { Age: 30, Weight: 180 };
      const updatedPatient = { Email: 'test@example.com', Name: 'tester', ...updates };
      Patient.findOneAndUpdate.mockResolvedValue(updatedPatient);

      const res = await request(app).put('/api/patients/me').send(updates);

      expect(Patient.findOneAndUpdate).toHaveBeenCalledWith(
        { Email: 'test@example.com' },
        updates,
        expect.objectContaining({ new: true, upsert: true })
      );
      expect(res.status).toBe(200);
      expect(res.body).toEqual(updatedPatient);
    });

    it('returns 500 when update fails', async () => {
      Patient.findOneAndUpdate.mockRejectedValue(new Error('update fail'));

      const res = await request(app).put('/api/patients/me').send({ Age: 40 });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Server error updating patient' });
      expect(consoleErrSpy).toHaveBeenCalled();
    });
  });
});