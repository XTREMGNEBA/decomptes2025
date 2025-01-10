import { H3Event } from 'h3'
import { Decompte } from '../../models/Decompte'

export default defineEventHandler(async (event: H3Event) => {
  try {
    const decomptes = await Decompte.find()
      .populate('organism')
      .populate('createdBy')
      .sort({ createdAt: -1 })
    
    return decomptes
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Error fetching decomptes'
    })
  }
})