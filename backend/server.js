import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js'
import appointmentRoutes from './routes/appointment.js'
import { connectDB } from './config/db.js';
import PatientRoutes from './routes/patient.js';
import cors from "cors";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());

//This line tells our express server to autamically parse incoming json data in the doby of http requests
app.use(express.json())

//This line registers out user related routes like regiester and login etc under api/users
app.use("/api/users", authRoutes)

// Register patient routes
app.use("/api/patient", PatientRoutes);
//this function just establishes the connection to the database.
connectDB();

app.listen(PORT, () => {  console.log(`Server started at port ${PORT}`); });




