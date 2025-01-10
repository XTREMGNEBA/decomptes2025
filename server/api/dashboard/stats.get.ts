import { H3Event } from 'h3'
import { Decompte } from '../../models/Decompte'
import { Organism } from '../../models/Organism'
import { User } from '../../models/User'

export default defineEventHandler(async (event: H3Event) => {
  try {
    const [decomptes, organisms, users] = await Promise.all([
      Decompte.countDocuments(),
      Organism.countDocuments(),
      User.countDocuments()
    ])

    return {
      decomptes,
      organisms,
      users
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Error fetching dashboard statistics'
    })
  }
})