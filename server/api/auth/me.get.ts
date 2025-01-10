import type { H3Event } from 'h3'
import { createError } from 'h3'
import { User } from '../../models/User'

export default defineEventHandler(async (event: H3Event) => {
  const auth = event.context.auth
  
  if (!auth?.userId) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  try {
    const user = await User.findById(auth.userId).select('-password')
    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      })
    }
    
    return user
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Error fetching user data'
    })
  }
})