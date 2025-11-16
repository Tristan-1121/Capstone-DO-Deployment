import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
      unique: true, // one note per appointment (upsert behavior)
      index: true,
    },
    practitionerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
      index: true,
    },
    summary: { type: String, default: '' },      // visit summary / HPI
    plan: { type: String, default: '' },         // treatment plan
    followUps: [{ type: String, trim: true }],   // short follow-up items
    private: { type: Boolean, default: true },   // notes are private to practitioner by default
  },
  { timestamps: true }
);

export default mongoose.model('Note', noteSchema);