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
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  countryCode: String,
  phoneNumber: String,
  role: { 
    type: String, 
    enum: ['admin', 'validator', 'auditor', 'signer'], 
    default: 'validator',
    required: true
  },
  organism: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Organism',
    required: function() {
      return this.role !== 'admin'
    }
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

// Middleware pre-save pour mettre à jour updatedAt
userSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

export const User = mongoose.model<IUser>('User', userSchema)