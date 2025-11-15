import mongoose from 'mongoose';

const callBackSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
    Phone: { type: String },
    Email: { type: String },
    Reason: { type: String, required: true },
    notes: { type: String },
    Status: { type: String, default: 'pending'}
});

export default mongoose.model('CallBack', callBackSchema);
