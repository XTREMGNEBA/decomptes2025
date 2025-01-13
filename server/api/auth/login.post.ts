import { readBody, createError } from 'h3'
import { User } from '~/server/models/User'
import { comparePassword } from '~/server/utils/auth'
import jwt from 'jsonwebtoken'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await connectDB()
  console.log('✅ Connexion à la base de données établie')
  
  try {
    const { email, password } = await readBody(event)
    console.log('🔍 Lecture des données envoyées:', { email })
    
    if (!email || !password) {
      console.warn('⚠️ Email ou mot de passe manquant')
      throw createError({
        statusCode: 400,
        message: 'Email et mot de passe requis'
      })
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      console.warn(`⚠️ Utilisateur introuvable pour l'email: ${email}`)
      throw createError({
        statusCode: 401,
        message: 'Identifiants invalides'
      })
    }
    console.log('✅ Utilisateur trouvé:', { email })

    const isValid = await comparePassword(password, user.password)
    if (!isValid) {
      console.warn('⚠️ Mot de passe invalide pour:', { email })
      throw createError({
        statusCode: 401,
        message: 'Identifiants invalides'
      })
    }
    console.log('✅ Authentification réussie pour:', { email })

    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '24h' }
    )
    console.log('✅ Token généré avec succès pour:', { email })

    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    }
  } catch (error: any) {
    console.error('❌ Erreur lors de l\'authentification:', error.message)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur serveur'
    })
  }
})
