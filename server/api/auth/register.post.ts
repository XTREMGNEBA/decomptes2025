import { hashPassword } from '~/server/utils/auth'
import { User } from '~/server/models/User'
import { connectDB } from '~/server/utils/db'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  try {
    await connectDB()
    const body = await readBody(event)
    
    // Validate required fields
    if (!body.email || !body.password || !body.firstName || !body.lastName) {
      throw createError({
        statusCode: 400,
        message: 'Missing required fields'
      })
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: body.email })
    if (existingUser) {
      throw createError({
        statusCode: 400,
        message: 'Email already registered'
      })
    }

    // Hash password
    const hashedPassword = await hashPassword(body.password)

    // Create user
    const user = await User.create({
      email: body.email,
      password: hashedPassword,
      firstName: body.firstName,
      lastName: body.lastName,
      role: body.role || 'validator',
      countryCode: body.countryCode || '+225',
      phoneNumber: body.phoneNumber
    })

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '24h' }
    )

    // Return user without password
    const userWithoutPassword = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    }

    return {
      token,
      user: userWithoutPassword
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Error during registration'
    })
  }
})