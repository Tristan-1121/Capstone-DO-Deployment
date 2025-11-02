import mongoose from "mongoose";

const mediHistSchema = new mongoose.Schema({
  conditions: [String],
  surgeries:  [String],
  familyHistory: String,
  notes: String,
});

export default mediHistSchema;

