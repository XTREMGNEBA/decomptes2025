import { H3Event } from 'h3'
import { Decompte } from '../../models/Decompte'

export default defineEventHandler(async (event: H3Event) => {
  try {
    const id = event.context.params?.id
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Decompte ID is required'
      })
    }
    const decompte = await Decompte.findById(id)
      .populate('organism')
      .populate('createdBy')
      .populate('validations.user')
      .populate('signatures.user')
    
    if (!decompte) {
      throw createError({
        statusCode: 404,
        message: 'Decompte not found'
      })
    }
    
    return decompte
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Error fetching decompte'
    })
  }
})