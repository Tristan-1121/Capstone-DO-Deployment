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


