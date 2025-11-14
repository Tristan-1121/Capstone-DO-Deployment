import mongoose from 'mongoose';

const callBackSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
    Email: { type: String, required: true },
    Phone: { type: String, required: true },
    Reason: { type: String, required: true },
    Status: { type: String, default: 'pending'}
});

export default mongoose.model('CallBack', callBackSchema);
