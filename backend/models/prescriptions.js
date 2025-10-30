import mongoose from 'mongoose';

//prescriptions subdocument schema
const prescriptionSchema = new mongoose.Schema({
    medicationName: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
}, { _id: false });

export default prescriptionSchema;