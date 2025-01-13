import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/decomptes2025'

export async function connectDB() {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB est déjà connecté')
      return
    }

    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10
    }

    await mongoose.connect(MONGODB_URI, options)
    console.log('Connexion MongoDB établie')
  } catch (error) {
    console.error('Erreur de connexion MongoDB:', error)
    throw error
  }
}

export async function disconnectDB() {
  try {
    await mongoose.disconnect()
    console.log('Déconnexion MongoDB effectuée')
  } catch (error) {
    console.error('Erreur lors de la déconnexion MongoDB:', error)
    throw error
  }
}