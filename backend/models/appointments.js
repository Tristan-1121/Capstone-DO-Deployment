import mongoose from 'mongoose';
import noteSchema from './notes.js';

// appointment schema
const appointmentSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    date: { type: Date, required: true },
    timeStart: { type: String, required: true },
    timeEnd: { type: String, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['scheduled', 'completed', 'canceled'], default: 'scheduled' },
    notes: [noteSchema]
}, { timestamps: true });

// Export a Mongoose model (consistent with other models)
const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;