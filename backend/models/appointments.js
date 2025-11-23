import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    // Which patient the appointment belongs to
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // Which practitioner this appointment is with
    practitionerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Practitioner',
      required: true,
      index: true,
    },

    // Scheduled date parts (stored as text for easy input)
    date: { type: String, required: true },        // "YYYY-MM-DD"
    timeStart: { type: String, required: true },   // "HH:mm"
    timeEnd: { type: String, required: true },     // "HH:mm"

    type: {
      type: String,
      enum: ['Consultation', 'Follow-up', 'Check-up', 'Annual Physical', 'Lab Work'],
      required: true,
    },

    reason: { type: String, required: true, trim: true },

    // Derived timestamps used for sorting and queries
    startAt: { type: Date, index: true },
    endAt: { type: Date, index: true },

    status: {
      type: String,
      enum: ['scheduled', 'completed', 'canceled', 'no_show'],
      default: 'scheduled',
      index: true,
    },
  },
  { timestamps: true }
);

/**
 * Pre-validation hook
 * Computes startAt and endAt based on the date/time text inputs.
 *
 * --- Note ---
 * This is critical for practitioner upcoming/past queries,
 * so appointments persist across server restarts and remain consistent.
 */
appointmentSchema.pre('validate', function (next) {
  if (this.date && this.timeStart) {
    this.startAt = new Date(`${this.date}T${this.timeStart}:00`);
  }
  if (this.date && this.timeEnd) {
    this.endAt = new Date(`${this.date}T${this.timeEnd}:00`);
  }
  next();
});

export default mongoose.model('Appointment', appointmentSchema);
