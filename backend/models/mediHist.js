import mongoose from 'mongoose';

//medical history subdocument schema
const mediHistSchema = new mongoose.Schema({
    conditions: {type: String },
    surgeries: { type: String },
}, { _id: false });

export default mediHistSchema;