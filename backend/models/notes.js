import mongoose from 'mongoose';

//notes subdocument schema
const noteSchema = new mongoose.Schema({
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
}, { _id: false });

export default noteSchema;
