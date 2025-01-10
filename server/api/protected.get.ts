// server/api/protected.get.ts
import { defineEventHandler } from 'h3'

export default defineEventHandler((event) => {
  const user = event.context.auth
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  return {
    message: 'You are authenticated',
    user
  }
})