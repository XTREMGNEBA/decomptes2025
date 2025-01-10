// scripts/createAdmin.js
import { hashPassword } from '../server/utils/auth.js'
import { User } from '../server/models/User.js'
import { connectDB, disconnectDB } from '../server/utils/db.js'

async function createAdminUser() {
  try {
    await connectDB()

    const adminEmail = '2024dibo@gmail.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!' // Utiliser une variable d'environnement
    const hashedPassword = await hashPassword(adminPassword) // Hacher le mot de passe

    const existingAdmin = await User.findOne({ email: adminEmail })
    if (existingAdmin) {
      console.log('Admin user already exists')
      return
    }

    const admin = await User.create({
      firstName: 'Administrateur',
      email: adminEmail,
      password: hashedPassword, // Utiliser le mot de passe haché
      countryCode: '+225',
      phoneNumber: '0758966156',
      role: 'admin'
    })

    console.log('Admin user created successfully')
    console.log('Email:', adminEmail)
    console.log('Password:', adminPassword)
    console.log('Please change your password after first login')

  } catch (error) {
    console.error('Error creating admin user:', error)
  } finally {
    await disconnectDB()
  }
}

createAdminUser()