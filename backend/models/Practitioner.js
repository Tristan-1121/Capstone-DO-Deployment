import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const practitionerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  
  // ALWAYS use lowercase: password
  password: { type: String, required: true },

  role: { type: String, default: 'practitioner' },
});

// Correct password hashing middleware
practitionerSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Correct password comparison
practitionerSchema.methods.matchPassword = async function(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Practitioner", practitionerSchema);
