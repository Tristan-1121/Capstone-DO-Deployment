import mongoose from 'mongoose';
import mediHist from '/me/models/mediHist.js';
import prescriptions from '/me/models/prescriptions.js';
import allergies from '/me/models/allergies.js';

const patientHealthSchema = new mongoose.Schema({
    Age: { type: Number, required: true },
    Weight: { type: Number, required: true },
    Height: { type: Number, required: true },
    Sex: { type: String, required: true },
    MedHist: { type: mediHist, required: true },
    Prescriptions: { type: prescriptions, required: true },
    Allergies: { type: allergies, required: true },
});

export default patientHealthSchema;