import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { config } from 'dotenv'
import crypto from 'crypto'
import fs from 'fs/promises'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..')

async function generateSecret() {
  console.log('🔑 Generating JWT secret...')
  const JWT_SECRET = crypto.randomBytes(32).toString('hex')

  const envPath = join(rootDir, '.env')
  try {
    let envContent = ''
    try {
      envContent = await fs.readFile(envPath, 'utf8')
    } catch (error) {
      // File doesn't exist, will create new one
    }

    if (envContent.includes('JWT_SECRET=')) {
      envContent = envContent.replace(/JWT_SECRET=.*/g, `JWT_SECRET=${JWT_SECRET}`)
    } else {
      envContent += `\nJWT_SECRET=${JWT_SECRET}`
    }

    await fs.writeFile(envPath, envContent)
    console.log('✅ JWT secret generated and saved to .env')
  } catch (error) {
    console.error('❌ Error generating JWT secret:', error)
    throw error
  }
}

async function connectDB() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gestion-decomptes'
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB dans setup.js') 
    return mongoose
  } catch (error) {
    console.error('❌ MongoDB connection error dans setup.js:', error)
    throw error
  }
}

async function createAdmin() {
  console.log('👤 Creating admin user...')
  try {
    const adminEmail = '2024dibo@gmail.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123!'

    const User = mongoose.model('User', new mongoose.Schema({
      email: String,
      password: String,
      role: String
    }))

    const existingAdmin = await User.findOne({ email: adminEmail })
    if (existingAdmin) {
      console.log('ℹ️ Admin user already exists')
      return
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10)
    await User.create({
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN'
    })

    console.log('✅ Admin user created successfully')
    console.log('Email:', adminEmail)
    console.log('Password:', adminPassword)
    console.log('⚠️ Please change the password after first login')
  } catch (error) {
    console.error('❌ Error creating admin user:', error)
    throw error
  }
}

async function setup() {
  console.log('🚀 Starting project setup...')
  config()

  try {
    await generateSecret()
    const db = await connectDB()
    await createAdmin()
    await db.disconnect()
    console.log('✅ Setup completed successfully!')
  } catch (error) {
    console.error('❌ Setup failed:', error)
    process.exit(1)
  }
}

setup()