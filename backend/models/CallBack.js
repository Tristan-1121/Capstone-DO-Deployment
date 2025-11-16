// backend/models/CallBack.js
import mongoose from "mongoose";

const callBackSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
    Phone: { type: String },
    Email: { type: String },
    Reason: { type: String, required: true },
    notes: { type: String },
    Status: { type: String, default: 'pending'}
});

// One follow-up task (callback) for a patient
const callbackSchema = new Schema(
  {
    // Patient who should be contacted
    patient: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    // Practitioner responsible for this callback
    practitioner: {
      type: Schema.Types.ObjectId,
      ref: "Practitioner",
      required: true,
    },

    // Short description of why the callback is needed
    reason: {
      type: String,
      required: true,
      trim: true,
    },

    // Urgency level for the board
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    // Workflow state used for board columns
    status: {
      type: String,
      enum: ["pending", "in_progress", "resolved"],
      default: "pending",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const CallBack = mongoose.model("CallBack", callbackSchema);

export default CallBack;
