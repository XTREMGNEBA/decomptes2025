import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  countryCode: String,
  phoneNumber: String,
  role: { type: String, enum: ['admin', 'validator', 'auditor', 'signer'], default: 'validator' },
  organism: { type: mongoose.Schema.Types.ObjectId, ref: 'Organism' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

export const User = mongoose.model('User', userSchema)