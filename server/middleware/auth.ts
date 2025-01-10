// server\middleware\auth.ts
import { getHeader, createError } from 'h3'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Liste des routes publiques
  const publicPaths = [
    '/', 
    '/api/auth/login', 
    '/api/auth/register', 
    '/login',
    '/register',
    '/api/_nuxt_icon', // Autoriser l'accès aux icônes sans authentification
    '/_nuxt' // Autoriser l'accès aux ressources statiques
  ]
  
  // Vérifier si le chemin commence par une des routes publiques
  if (publicPaths.some(path => event.path.startsWith(path))) {
    // Cache public routes
    setHeader(event, 'Cache-Control', 'public, max-age=3600')
    return
  }
  

  try {
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }

    const token = authHeader.replace('Bearer ', '')
    if (!token) {
      throw createError({
        statusCode: 401,
        message: 'Invalid token format'
      })
    }

    const decoded = jwt.verify(token, config.jwtSecret)
    event.context.auth = decoded
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: 'Invalid or expired token'
    })
  }
})