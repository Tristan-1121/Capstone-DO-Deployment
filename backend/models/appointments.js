import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    // who owns the appointment (logged-in user)
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // which practitioner this appointment is with
    practitionerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // values sent from the frontend form
    date: { type: String, required: true },        // "YYYY-MM-DD"
    timeStart: { type: String, required: true },   // "HH:mm"
    timeEnd: { type: String, required: true },     // "HH:mm"
    type: {
      type: String,
      enum: ['Consultation', 'Follow-up', 'Check-up', 'Annual Physical', 'Lab Work'],
      required: true,
    },
    reason: { type: String, required: true, trim: true },

    // computed for fast queries/sorting
    startAt: { type: Date, index: true },
    endAt: { type: Date, index: true },

    // quick summary stored on appointment (optional)
    notesSummary: { type: String, default: '' },

    // reference to a Note document (if you use a separate Note model)
    noteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', index: true },

    status: {
      type: String,
      enum: ['scheduled', 'completed', 'canceled', 'no_show'],
      default: 'scheduled',
      index: true,
    },
  },
  { timestamps: true }
);

// derive startAt/endAt whenever we have date + time parts
appointmentSchema.pre('validate', function (next) {
  if (this.date && this.timeStart) this.startAt = new Date(`${this.date}T${this.timeStart}:00`);
  if (this.date && this.timeEnd) this.endAt = new Date(`${this.date}T${this.timeEnd}:00`);
  next();
});

export default mongoose.model('Appointment', appointmentSchema);
