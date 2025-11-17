import mongoose from "mongoose";

const { Schema } = mongoose;

const callbackSchema = new Schema(
  {
    // Patient who should be contacted
    patient: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    // Practitioner responsible
    practitioner: {
      type: Schema.Types.ObjectId,
      ref: "Practitioner",
      required: true,
    },

    // The reason for the callback
    reason: {
      type: String,
      required: true,
      trim: true,
    },

    // Callback due date (NEW)
    dueDate: {
      type: Date,
    },

    // Urgency level
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    // Board column
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

