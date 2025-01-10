//server\models\Organism.ts
import mongoose from 'mongoose'

const organismSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['public', 'private'], required: true },
  address: String,
  contact: {
    email: String,
    phone: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

export const Organism = mongoose.model('Organism', organismSchema)