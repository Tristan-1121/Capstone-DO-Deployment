import mongoose from "mongoose";

const allergySchema = new mongoose.Schema({
  allergen: { type: String, required: true },
  reaction: { type: String, required: true },
  severity: {
    type: String,
    enum: ["Mild", "Moderate", "Severe"],
    default: "Mild",
  },
});

const prescriptionSchema = new mongoose.Schema({
  medicationName: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
});

const mediHistSchema = new mongoose.Schema({
  conditions: [String],
  surgeries: [String],
  familyHistory: String,
  notes: String,
});

const patientSchema = new mongoose.Schema({
  Email: { type: String, required: true },
    Name: { type: String, required: true },
  Age: { type: Number },
  Weight: { type: Number },
  Height: { type: Number },
  Sex: { type: String },
  Phone: { type: String },
  Address: { type: String },
  City: { type: String },
  State: { type: String },
  Zip: { type: String },

  MedHist: [mediHistSchema],
  Prescriptions: [prescriptionSchema],
  Allergies: [allergySchema],
});

export default mongoose.model("Patient", patientSchema);


