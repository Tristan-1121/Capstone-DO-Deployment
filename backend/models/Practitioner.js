//Mongoose schema and model for Practitioner
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

//schema definition
const practitionerSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'practitioner'},
});

//hash password before saving
practitionerSchema.pre('save', async function (next) {
  if (!this.isModified('Password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.Password = await bcrypt.hash(this.Password, salt);
  next();
});

//model creation
const Practitioner = mongoose.model('Practitioner', practitionerSchema);

//exporting the model
export default Practitioner;