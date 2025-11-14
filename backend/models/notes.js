import mongoose from 'mongoose';

const DOSAGE_OPTIONS = ['none', 'low', 'medium', 'high', 'custom'];
const FREQUENCY_OPTIONS = ['none', 'once', 'daily', 'weekly', 'monthly', 'as_needed'];

const noteSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
    practitionerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },

    // Optional dropdowns / additional fields
    dosage: { type: String, enum: DOSAGE_OPTIONS, default: 'none' }, // dropdown
    frequency: { type: String, enum: FREQUENCY_OPTIONS, default: 'none' }, // dropdown
    additionalNotes: { type: String }, // free-text box

    callBack: { type: mongoose.Schema.Types.ObjectId, ref: 'CallBack' },
  },
  { timestamps: true }
);

export default mongoose.model('Notes', noteSchema);
