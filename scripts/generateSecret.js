import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const envPath = path.resolve(process.cwd(), '.env')
const JWT_SECRET = crypto.randomBytes(32).toString('hex')

try {
  let envContent = ''
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8')
  }

  if (envContent.includes('JWT_SECRET=')) {
    envContent = envContent.replace(/JWT_SECRET=.*/g, `JWT_SECRET=${JWT_SECRET}`)
  } else {
    envContent += `\nJWT_SECRET=${JWT_SECRET}`
  }

  fs.writeFileSync(envPath, envContent)
  console.log('✅ New JWT_SECRET generated successfully and added to .env')
} catch (error) {
  console.error('❌ Error generating JWT_SECRET:', error)
  process.exit(1)
}