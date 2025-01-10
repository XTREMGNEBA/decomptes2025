import { Organism } from '~/server/models/Organism'

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID de l\'organisme requis'
      })
    }

    const organism = await Organism.findById(id)
    if (!organism) {
      throw createError({
        statusCode: 404,
        message: 'Organisme non trouvé'
      })
    }

    return organism
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la récupération de l\'organisme'
    })
  }
})