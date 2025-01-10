import { H3Event } from 'h3'
import { User } from '../../models/User'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event: H3Event) => {
  const { email, password, firstName, lastName, role = 'validator' } = await readBody(event)
  
  // Vérifier si l'utilisateur existe déjà
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw createError({
      statusCode: 400,
      message: 'Email already registered'
    })
  }
  
  // Hacher le mot de passe avant de créer l'utilisateur
  const hashedPassword = await bcrypt.hash(password, 10)
  
  // Créer un nouvel utilisateur
  const user = await User.create({
    email,
    password: hashedPassword, // Stocker le mot de passe haché
    firstName,
    lastName,
    role
  })
  
  // Générer un token JWT
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  )
  
  return { token }
})
