import request from 'supertest';
import express from 'express';
import practitionerRoutes from './practitioner.js';
import { protect } from '../middleware/auth.js';
import Practitioner from '../models/Practitioner.js';
import Appointment from '../models/appointments.js';

jest.mock('../middleware/auth.js', () => ({
  protect: jest.fn(),
}));

jest.mock('../models/Practitioner.js');
jest.mock('../models/appointments.js');

const app = express();
app.use(express.json());
app.use('/api/practitioners', practitionerRoutes);

describe('Practitioner Routes', () => {
    beforeEach(() => {
        // Reset the protect middleware mock to default practitioner user
        protect.mockImplementation((req, res, next) => {
            req.user = { 
                _id: 'mockUserId', 
                email: 'test@example.com', 
                role: 'practitioner',
                practitionerId: 'mockPractitionerId'
            };
            next();
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/practitioners/list', () => {
        it('should return a list of practitioners', async () => {
            const mockPractitioners = [
                {
                    _id: 'practitioner1',
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                    role: 'practitioner'
                }
            ];

            const mockSelectChain = {
                select: jest.fn().mockResolvedValue(mockPractitioners)
            };
            Practitioner.find.mockReturnValue(mockSelectChain);

            const res = await request(app).get('/api/practitioners/list');
            
            expect(res.statusCode).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
            expect(res.body[0]).toHaveProperty('firstName', 'John');
            expect(res.body[0]).toHaveProperty('lastName', 'Doe');
            expect(mockSelectChain.select).toHaveBeenCalledWith('_id firstName lastName email role');
        });

        it('should return a 500 error if there is a server error', async () => {
            const mockSelectChain = {
                select: jest.fn().mockRejectedValue(new Error('Database error'))
            };
            Practitioner.find.mockReturnValue(mockSelectChain);

            const res = await request(app).get('/api/practitioners/list');
            
            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('message', 'Error fetching practitioners');
        });
    });

    describe('GET /api/practitioners/me/appointments', () => {
        it('should return upcoming appointments for the practitioner', async () => {
            const startAtDate = new Date(Date.now() + 86400000); // tomorrow
            const mockAppointments = [
                {
                    _id: 'appointment1',
                    practitionerId: 'mockPractitionerId',
                    patientId: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
                    startAt: startAtDate.toISOString(), // Convert to ISO string to match JSON serialization
                    status: 'scheduled'
                }
            ];

            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                sort: jest.fn().mockResolvedValue(mockAppointments)
            };
            Appointment.find.mockReturnValue(mockQuery);

            const res = await request(app).get('/api/practitioners/me/appointments');
            
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockAppointments);
        });

        it('should return 403 if user is not a practitioner', async () => {
            // Temporarily change the mock to simulate a patient user
            protect.mockImplementationOnce((req, res, next) => {
                req.user = { _id: 'mockUserId', role: 'patient' };
                next();
            });

            const res = await request(app).get('/api/practitioners/me/appointments');
            
            expect(res.statusCode).toBe(403);
            expect(res.body).toHaveProperty('message', 'Not authorized');
        });
    });

    describe('GET /api/practitioners/me/patients', () => {
        it('should return unique patients for the practitioner', async () => {
            const mockAppointments = [
                {
                    patientId: { 
                        _id: 'patient1', 
                        firstName: 'John', 
                        lastName: 'Doe', 
                        email: 'john@example.com' 
                    }
                }
            ];

            const mockQuery = {
                populate: jest.fn().mockResolvedValue(mockAppointments)
            };
            Appointment.find.mockReturnValue(mockQuery);

            const res = await request(app).get('/api/practitioners/me/patients');
            
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveLength(1);
        });
    });

    describe('GET /api/practitioners/me/summary', () => {
        it('should return practitioner dashboard summary', async () => {
            Appointment.distinct.mockResolvedValue(['patient1', 'patient2']);
            Appointment.countDocuments.mockResolvedValue(3);

            const res = await request(app).get('/api/practitioners/me/summary');
            
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('totalPatients', 2);
            expect(res.body).toHaveProperty('upcomingAppointments', 3);
            expect(res.body).toHaveProperty('callbackNeeded', 0);
        });

        it('should return 400 if practitionerId is missing', async () => {
            protect.mockImplementationOnce((req, res, next) => {
                req.user = { _id: 'mockUserId', role: 'practitioner' }; // no practitionerId
                next();
            });

            const res = await request(app).get('/api/practitioners/me/summary');
            
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message', 'Practitioner ID missing.');
        });
    });
});