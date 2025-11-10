import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // fixed log string — now shows the real DB host instead of ${conn...}
    console.log(`MongoDB connected ${conn.connection.host}`);
  } catch (err) {
    // improved error detail
    console.error('Mongo connection error:', err.message);
    process.exit(1);
  }
};
