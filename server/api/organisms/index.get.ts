import { Organism } from '~/server/models/Organism'

export default defineEventHandler(async () => {
  try {
    const organisms = await Organism.find().sort({ createdAt: -1 })
    return organisms
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la récupération des organismes'
    })
  }
})