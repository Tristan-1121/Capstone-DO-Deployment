import mongoose from "mongoose";

const patientHealthSchema = new mongoose.Schema({
    Age: { type: Number, required: true },
    Weight: { type: Number, required: true },
    Height: { type: Number, required: true },
    Sex: { type: String, required: true },
    MedHist: { [medicalHistory], required: true },
    Prescriptions: { [prescriptions], required: true },
    Allergies: { [allergies], required: true },
})


