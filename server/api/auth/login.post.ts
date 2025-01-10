// server/api/auth/login.post.ts
import { readBody, createError } from 'h3'
import { User } from '~/server/models/User'
import { comparePassword}  from '~/server/utils/auth'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { email, password } = await readBody(event)

  try {
    // Trouver l'utilisateur par email
    const user = await User.findOne({ email })
    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Invalid credentials'
      })
    }

    // Vérifier le mot de passe
    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        message: 'Invalid credentials'
      })
    }

    // Générer le token JWT
    const token = jwt.sign(
      { 
        userId: user._id, 
        role: user.role,
        email: user.email,
        firstName: user.firstName
      },
      config.jwtSecret,
      { expiresIn: '24h' }
    )

    // Retourner la réponse
    return { 
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        role: user.role
      }
    }
  } catch (error) {
    console.error('Login error:', error)
    throw createError({
      statusCode: 500,
      message: 'Internal server error'
    })
  }
})