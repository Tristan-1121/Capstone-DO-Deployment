// backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import patientRoutes from './routes/patient.js';
import appointmentRoutes from './routes/appointment.js';
import callBackRoutes from './routes/callBack.js';
import { connectDB } from './config/db.js'; 
import { seedPractitioners } from './seed.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json());



// Routes
app.use('/api/users', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/callbacks', callBackRoutes);

// DB + start
connectDB();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  seedPractitioners(); // Seed practitioner users on server start
});