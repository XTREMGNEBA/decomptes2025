import { H3Event } from 'h3'
import { User } from '../../models/User'

export default defineEventHandler(async (event: H3Event) => {
  const method = event.method
  const id = event.context.params?.id
  const auth = event.context.auth

  // Vérifier les permissions d'administration
  if (auth.role !== 'admin') {
    throw createError({
      statusCode: 403,
      message: 'Permission refusée'
    })
  }

  try {
    switch (method) {
      case 'GET':
        const user = await User.findById(id).populate('organism')
        if (!user) {
          throw createError({
            statusCode: 404,
            message: 'Utilisateur non trouvé'
          })
        }
        return user

      case 'PUT':
        const body = await readBody(event)
        const updatedUser = await User.findByIdAndUpdate(
          id,
          { 
            $set: {
              firstName: body.firstName,
              lastName: body.lastName,
              email: body.email,
              role: body.role,
              organism: body.organism,
              status: body.status,
              countryCode: body.countryCode,
              phoneNumber: body.phoneNumber,
              updatedAt: new Date()
            }
          },
          { new: true }
        ).populate('organism')
        
        if (!updatedUser) {
          throw createError({
            statusCode: 404,
            message: 'Utilisateur non trouvé'
          })
        }
        return updatedUser

      case 'DELETE':
        const deletedUser = await User.findByIdAndDelete(id)
        if (!deletedUser) {
          throw createError({
            statusCode: 404,
            message: 'Utilisateur non trouvé'
          })
        }
        return { message: 'Utilisateur supprimé avec succès' }

      default:
        throw createError({
          statusCode: 405,
          message: 'Méthode non autorisée'
        })
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur serveur'
    })
  }
})