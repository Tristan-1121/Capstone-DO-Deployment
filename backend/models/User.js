import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Strong password policy:
// ≥8 chars, at least 1 uppercase, 1 lowercase, 1 digit, 1 special
const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    email:    { type: String, required: true, unique: true, trim: true, lowercase: true },

    // Enforce password rules at the schema level
    password: {
      type: String,
      required: true,
      validate: {
        validator: (val) => PASSWORD_RE.test(val),
        message:
          'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.',
      },
    },

    // Structured name fields
    firstName: { type: String, trim: true },
    lastName:  { type: String, trim: true },
    fullName:  { type: String, trim: true },

    // Role used for authorization (patient | practitioner | admin)
    role: { type: String, enum: ['patient', 'practitioner', 'admin'], default: 'patient' },

    // Array of medical history tags
    healthHistory: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

// Normalize and derive computed fields before validation
userSchema.pre('validate', function (next) {
  if (this.email) this.email = this.email.toLowerCase().trim();
  if (this.username) this.username = this.username.toLowerCase().trim();

  if ((this.firstName || this.lastName) && !this.fullName) {
    const fn = (this.firstName || '').trim();
    const ln = (this.lastName || '').trim();
    this.fullName = [fn, ln].filter(Boolean).join(' ');
  }

  // Default username to the local part of the email
  if (!this.username && this.email) {
    this.username = this.email.split('@')[0];
  }

  next();
});

// Hash password before storing (only when changed)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare plain text password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
