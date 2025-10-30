import mongoose from 'mongoose';

//allergy subdocument schema
const allergySchema = new mongoose.Schema({
    allergen: { type: String, required: true },
    reaction: { type: String, required: true },
}, { _id: false });

export default allergySchema;