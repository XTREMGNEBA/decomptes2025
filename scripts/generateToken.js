import jwt from 'jsonwebtoken'
import { config } from 'dotenv'

config()

const JWT_SECRET = process.env.JWT_SECRET || 'default_fallback_secret'
const TOKEN_EXPIRATION = '7d'

const payload = {
  app: 'gestion-decomptes',
  createdAt: new Date().toISOString()
}

const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION })

console.log('✅ JWT Token generated:', token)