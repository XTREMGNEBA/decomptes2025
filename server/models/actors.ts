import mongoose, { Schema, model, Document } from 'mongoose';

interface Actor extends Document {
  firstName: string;
  lastName: string;
  email: string;
  role: 'validator' | 'auditor' | 'signer' | 'admin';
  organism: string;
  countryCode: string;
  phoneNumber: string;
}

const ActorSchema = new Schema<Actor>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['validator', 'auditor', 'signer', 'admin'], required: true },
  organism: { type: String, required: true },
  countryCode: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

// Vérifie si le modèle existe déjà avant de le créer
const ActorModel = mongoose.models.Actor || model<Actor>('Actor', ActorSchema);

export { ActorModel };
