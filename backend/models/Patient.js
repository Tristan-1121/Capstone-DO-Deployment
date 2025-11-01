import mongoose from "mongoose";
import mediHistSchema from "./mediHist.js";
import prescriptionSchema from "./prescriptions.js";
import allergySchema from "./allergies.js";

const patientHealthSchema = new mongoose.Schema({
  Email:   { type: String, required: true },
  Name:    { type: String, required: true },
  Age:     { type: Number, required: true },
  Weight:  { type: Number, required: true },
  Height:  { type: Number, required: true },
  Sex:     { type: String, required: true },

  MedHist: [mediHistSchema],         // embedded array of medical-history objects
  Prescriptions: [prescriptionSchema],
  Allergies: [allergySchema],
});

export default mongoose.model("Patient", patientHealthSchema);



