import { H3Event } from 'h3'
import { Organism } from '../../models/Organism'

export default defineEventHandler(async (event: H3Event) => {
  try {
    // Vérifier les permissions
    const auth = event.context.auth
    if (auth.role !== 'admin') {
      throw createError({
        statusCode: 403,
        message: 'Permission refusée'
      })
    }

    const body = await readBody(event)

    // Validation des données
    if (!body.name || !body.type || !body.contact?.email) {
      throw createError({
        statusCode: 400,
        message: 'Données invalides'
      })
    }

    // Vérifier si l'organisme existe déjà
    const existingOrganism = await Organism.findOne({ name: body.name })
    if (existingOrganism) {
      throw createError({
        statusCode: 400,
        message: 'Un organisme avec ce nom existe déjà'
      })
    }

    const organism = new Organism({
      name: body.name,
      type: body.type,
      address: body.address,
      contact: {
        email: body.contact.email,
        phone: body.contact.phone
      }
    })

    await organism.save()

    return organism
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur lors de la création de l\'organisme'
    })
  }
})