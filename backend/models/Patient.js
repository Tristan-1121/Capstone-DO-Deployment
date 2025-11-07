import mongoose from "mongoose";
import mediHistSchema from "./mediHist.js";
import prescriptionSchema from "./prescriptions.js";
import allergySchema from "./allergies.js";

const patientSchema = new mongoose.Schema({
  // 🔗 Link to User
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    unique: true, // each user has exactly one patient record
    required: true 
  },

  // 👤 Core patient demographics
  Email:   { type: String, required: true },
  Name:    { type: String, required: true },
  Age:     { type: Number, default: 0 },
  Weight:  { type: Number, default: 0 },
  Height:  { type: Number, default: 0 },
  Sex:     { type: String, default: "" },
  Phone:   { type: String, default: "" },
  Address: { type: String, default: "" },
  City:    { type: String, default: "" },
  State:   { type: String, default: "" },
  Zip:     { type: String, default: "" },

  // 🧠 Embedded subdocuments
  MedHist: [mediHistSchema],
  Prescriptions: [prescriptionSchema],
  Allergies: [allergySchema],
}, { timestamps: true });

export default mongoose.model("Patient", patientSchema);


