import { H3Event } from 'h3'
import { User } from '../../models/User'
import { hashPassword } from '../../utils/auth'

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
    if (!body.email || !body.password || !body.role || !body.firstName || !body.lastName) {
      throw createError({
        statusCode: 400,
        message: 'Données invalides'
      })
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email: body.email })
    if (existingUser) {
      throw createError({
        statusCode: 400,
        message: 'Un utilisateur avec cet email existe déjà'
      })
    }

    // Vérifier si un organisme est requis pour ce rôle
    if (body.role !== 'admin' && !body.organism) {
      throw createError({
        statusCode: 400,
        message: 'Un organisme est requis pour ce rôle'
      })
    }

    // Hasher le mot de passe
    const hashedPassword = await hashPassword(body.password)

    const user = new User({
      email: body.email,
      password: hashedPassword,
      firstName: body.firstName,
      lastName: body.lastName,
      role: body.role,
      organism: body.organism,
      countryCode: body.countryCode,
      phoneNumber: body.phoneNumber,
      status: 'active'
    })

    await user.save()

    // Ne pas renvoyer le mot de passe
    const { password, ...userWithoutPassword } = user.toObject()
    return userWithoutPassword
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur lors de la création de l\'utilisateur'
    })
  }
})