import mongoose from 'mongoose'

const decompteSchema = new mongoose.Schema({
  reference: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: function(v: string) {
        return /^DC-\d{4}-\d{5}$/.test(v)
      },
      message: 'Le format de référence doit être DC-YYYY-XXXXX'
    }
  },
  title: { 
    type: String, 
    required: true,
    minlength: [5, 'Le titre doit contenir au moins 5 caractères'],
    maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
  },
  organism: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Organism', 
    required: true 
  },
  status: {
    type: String,
    enum: ['draft', 'pending_validation', 'validated', 'pending_signature', 'signed', 'rejected', 'closed'],
    default: 'draft'
  },
  amount: { 
    type: Number, 
    required: true,
    min: [0, 'Le montant ne peut pas être négatif']
  },
  currency: { 
    type: String, 
    default: 'XOF',
    enum: ['XOF', 'EUR', 'USD']
  },
  workflow: {
    currentStep: { type: Number, default: 0 },
    steps: [{
      order: Number,
      role: { 
        type: String,
        enum: ['validator', 'auditor', 'signer']
      },
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected']
      },
      user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
      },
      date: Date,
      comments: String
    }]
  },
  validations: [{
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    date: Date,
    status: { 
      type: String, 
      enum: ['approved', 'rejected'] 
    },
    comments: String
  }],
  signatures: [{
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    date: Date,
    signature: {
      type: String,
      required: true
    },
    certificateInfo: {
      issuer: String,
      validFrom: Date,
      validTo: Date,
      serialNumber: String
    }
  }],
  attachments: [{
    name: String,
    path: String,
    type: String,
    uploadedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    uploadedAt: { 
      type: Date, 
      default: Date.now 
    }
  }],
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Middleware pre-save
decompteSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  
  // Générer automatiquement la référence si elle n'existe pas
  if (!this.reference) {
    const year = new Date().getFullYear()
    const count = Math.floor(10000 + Math.random() * 90000)
    this.reference = `DC-${year}-${count}`
  }
  
  next()
})

// Méthodes d'instance
decompteSchema.methods.canBeValidatedBy = function(userId: string) {
  const currentStep = this.workflow.steps[this.workflow.currentStep]
  return currentStep && currentStep.user.toString() === userId.toString()
}

decompteSchema.methods.canBeSignedBy = function(userId: string) {
  return this.status === 'pending_signature' && 
         this.workflow.steps.some(step => 
           step.role === 'signer' && 
           step.user.toString() === userId.toString())
}

export const Decompte = mongoose.model('Decompte', decompteSchema)