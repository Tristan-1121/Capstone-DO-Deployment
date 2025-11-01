import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    practitionerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    reason: {
      type: String,
      required: true,
      trim: true
    },
    start: {
      type: Date,
      required: true,
      index: true
    },
    end: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'canceled', 'no_show'],
      default: 'scheduled',
      index: true
    }
  },
  { timestamps: true }
);

appointmentSchema.index({ practitionerId: 1, start: 1 });

export default mongoose.model('Appointment', appointmentSchema);
