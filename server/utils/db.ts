import mongoose from 'mongoose'

let isConnected = false

export async function connectDB() {
  if (isConnected) {
    console.log('Déjà connecté à MongoDB')
    return
  }

  try {
    const options = {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      retryWrites: true,
      w: 'majority'
    }

    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/test'
    console.log('Tentative de connexion à MongoDB...')
    
    await mongoose.connect(uri, options)
    isConnected = true
    console.log('Connexion à MongoDB établie avec succès')
  } catch (error) {
    console.error('Erreur de connexion MongoDB:', error)
    isConnected = false
    throw error
  }
}

export async function disconnectDB() {
  if (!isConnected) return
  
  try {
    await mongoose.disconnect()
    isConnected = false
    console.log('Déconnexion de MongoDB effectuée')
  } catch (error) {
    console.error('Erreur lors de la déconnexion MongoDB:', error)
    throw error
  }
}