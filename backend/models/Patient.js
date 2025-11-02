import mongoose from "mongoose";

<<<<<<< HEAD
const patientHealthSchema = new mongoose.Schema({
    Age: { type: Number, required: true },
    Weight: { type: Number, required: true },
    Height: { type: Number, required: true },
    Sex: { type: String, required: true },
    MedHist: { [medicalHistory], required: true },
    Prescriptions: { [prescriptions], required: true },
    Allergies: { [allergies], required: true },
})
=======
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


>>>>>>> c439b79cf8d49f1acab487e9cb480b328f2fe3b2


