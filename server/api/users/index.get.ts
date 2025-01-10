import { H3Event } from 'h3'
import { User } from '../../models/User'

export default defineEventHandler(async (event: H3Event) => {
  const auth = event.context.auth
  const query = getQuery(event)

  // Vérifier les permissions d'administration
  if (auth.role !== 'admin') {
    throw createError({
      statusCode: 403,
      message: 'Permission refusée'
    })
  }

  try {
    const filters: any = {}

    // Appliquer les filtres de recherche
    if (query.role) {
      filters.role = query.role
    }
    if (query.status) {
      filters.status = query.status
    }
    if (query.organism) {
      filters.organism = query.organism
    }
    if (query.search) {
      filters.$or = [
        { firstName: { $regex: query.search, $options: 'i' } },
        { lastName: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } }
      ]
    }

    const users = await User.find(filters)
      .populate('organism')
      .sort({ createdAt: -1 })
      .select('-password')

    return users
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Erreur lors de la récupération des utilisateurs'
    })
  }
})