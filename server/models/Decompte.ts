import mongoose from 'mongoose'

const decompteSchema = new mongoose.Schema({
  reference: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  organism: { type: mongoose.Schema.Types.ObjectId, ref: 'Organism', required: true },
  status: {
    type: String,
    enum: ['draft', 'pending', 'validated', 'signed', 'closed'],
    default: 'draft'
  },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'EUR' },
  validations: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: Date,
    status: { type: String, enum: ['approved', 'rejected'] },
    comments: String
  }],
  signatures: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: Date,
    signature: String
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

export const Decompte = mongoose.model('Decompte', decompteSchema)