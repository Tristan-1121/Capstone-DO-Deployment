import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js'
import { connectDB } from './config/db.js';
dotenv.config();


const PORT = process.env.PORT || 5000;

const app = express();

//This line tells our express server to autamically parse incoming json data in the doby of http requests
app.use(express.json())

//This line registers out user related routes like regiester and login etc under api/users
app.use("/api/users", authRoutes)


//this function just establishes the connection to the database.
connectDB();

app.listen(PORT, () => {  console.log(`Server started at port ${PORT}`); });





