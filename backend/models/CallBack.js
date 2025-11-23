import mongoose from "mongoose";

const { Schema } = mongoose;

const callbackSchema = new Schema(
  {
    // Patient is actually a User (patients and practitioners are Users)
    // Updated: ref changed from "Patient" → "User"
    patient: {
      type: Schema.Types.ObjectId,
      ref: "User", // ✔ FIXED
      required: true,
    },

    // Practitioner responsible
    practitioner: {
      type: Schema.Types.ObjectId,
      ref: "Practitioner",
      required: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    dueDate: {
      type: Date,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    status: {
      type: String,
      enum: ["pending", "in_progress", "resolved"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const CallBack = mongoose.model("CallBack", callbackSchema);

export default CallBack;
