import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    //New fields for patient profile 
    fullName: { type: String, trim: true },
    age: { type: Number, min: 0 },
    weight: { type: Number, min: 0 },
    
    // patient | practitioner | admin
    role: { type: String, enum: ['patient', 'practitioner', 'admin'], default: 'patient' },

    // Array of medical history tags
    healthHistory: [{ type: String, trim: true }]
}, { timestamps: true });

// Hash password before storing
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare entered password to hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
