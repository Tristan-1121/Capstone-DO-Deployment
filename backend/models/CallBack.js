// backend/models/CallBack.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const callBackSchema = new Schema(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
    practitionerId: { type: Schema.Types.ObjectId, ref: "User" },

    // contact info (prefer patient record contact)
    Phone: { type: String },
    Email: { type: String },

    // main fields
    Reason: { type: String, required: true, trim: true },
    notes: { type: String },

    // workflow fields
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    status: { type: String, enum: ["pending", "in_progress", "resolved"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("CallBack", callBackSchema);
