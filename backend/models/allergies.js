import mongoose from "mongoose";

const allergySchema = new mongoose.Schema({
  allergen: { type: String, required: true },
  reaction: { type: String, required: true },
  severity: { type: String, enum: ["Mild", "Moderate", "Severe"], default: "Mild" },
});

export default allergySchema;
