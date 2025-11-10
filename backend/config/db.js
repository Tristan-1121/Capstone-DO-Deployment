import mongoose from 'mongoose'

export const connectDB = async () => {

try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected ${conn.connection.host}`);

} catch(err) {
    console.log(err);
    process.exit(1);

}

}

export const mongoAdminConnection = async () => {
    try {
        const adminConn = await mongoose.connect(process.env.MONGO_ADMIN_URI);
        console.log(`MongoDB Admin connected ${adminConn.connection.host}`);
    } catch(err) {
        console.log(err);
        process.exit(1);
    }
}