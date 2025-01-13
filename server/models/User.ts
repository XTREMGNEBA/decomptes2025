import mongoose, { Document } from 'mongoose'

interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  countryCode?: string;
  phoneNumber?: string;
  role: 'admin' | 'validator' | 'auditor' | 'signer';
  organism?: mongoose.Types.ObjectId;
  status?: 'active' | 'inactive';
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: true,
    select: false // Don't return password by default
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  countryCode: { type: String, default: '+225' },
  phoneNumber: String,
  role: { 
    type: String, 
    enum: ['admin', 'validator', 'auditor', 'signer'], 
    default: 'validator'
  },
  organism: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Organism'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Update timestamps
userSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema)