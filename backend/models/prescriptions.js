import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
  medicationName: { type: String, required: true },
  dosage:         { type: String, required: true },
  frequency:      { type: String, required: true },
});

export default prescriptionSchema;
