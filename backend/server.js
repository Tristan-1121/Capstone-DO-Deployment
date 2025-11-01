// backend/server.js
// Express init + routes

import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import patientRoutes from './routes/patient.js';
import appointmentRoutes from './routes/appointment.js';
import { connectDB } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());

// routes
app.use('/api/users', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);

connectDB();

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
