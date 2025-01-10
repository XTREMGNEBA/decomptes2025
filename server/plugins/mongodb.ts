import { connectDB } from '../utils/db'
import { User } from '../models/User'
import { hashPassword } from '../utils/auth'

async function createInitialAdmin() {
  try {
    console.log('Vérification de l\'existence d\'un administrateur...')
    
    // Attendre que la connexion soit établie avant de faire la requête
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const adminExists = await User.findOne({ role: 'admin' }).exec()
    
    if (!adminExists) {
      console.log('Aucun administrateur trouvé. Création de l\'administrateur initial...')
      
      const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!'
      const hashedPassword = await hashPassword(adminPassword)

      const adminData = {
        firstName: 'Administrateur',
        email: '2024dibo@gmail.com',
        password: hashedPassword,
        countryCode: '+225',
        phoneNumber: '0758966156',
        role: 'admin'
      }

      const admin = new User(adminData)
      await admin.save()

      console.log('Compte administrateur créé avec succès:', {
        email: admin.email,
        role: admin.role
      })
      
      return admin
    } else {
      console.log('Un compte administrateur existe déjà:', {
        email: adminExists.email,
        role: adminExists.role
      })
      return adminExists
    }
  } catch (error) {
    console.error('Erreur lors de la création du compte administrateur:', error)
    throw error
  }
}

export default defineNitroPlugin(async () => {
  let retries = 3
  let connected = false

  while (retries > 0 && !connected) {
    try {
      console.log(`Tentative de connexion à MongoDB (${retries} essais restants)...`)
      await connectDB()
      connected = true
      
      console.log('Connexion à MongoDB établie, initialisation de l\'administrateur...')
      const admin = await createInitialAdmin()
      
      if (admin) {
        console.log('Initialisation MongoDB terminée avec succès')
      }
    } catch (error) {
      console.error(`Échec de l'initialisation MongoDB (tentative ${4 - retries}/3):`, error)
      retries--
      
      if (retries > 0) {
        console.log('Nouvelle tentative dans 5 secondes...')
        await new Promise(resolve => setTimeout(resolve, 5000))
      }
    }
  }

  if (!connected) {
    console.error('Impossible de se connecter à MongoDB après 3 tentatives')
    process.exit(1) // Arrêter le serveur si la connexion échoue
  }
})