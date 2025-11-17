import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      index: true,
    },

    practitionerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Practitioner",
      required: true,
    },

    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    subjective: { type: String, default: "" },
    objective: { type: String, default: "" },
    assessment: { type: String, default: "" },
    plan: { type: String, default: "" },

    // Optional callback inside a note
    callback: {
      reason: { type: String },
      dueDate: { type: String }, // "YYYY-MM-DD"
      priority: { type: String, enum: ["low", "medium", "high"] },
      status: { type: String, enum: ["pending", "in_progress", "resolved"], default: "pending" }
    },
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);
