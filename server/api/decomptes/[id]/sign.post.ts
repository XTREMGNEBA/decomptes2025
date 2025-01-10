import { H3Event } from 'h3'
import { Decompte } from '../../../models/Decompte'

export default defineEventHandler(async (event: H3Event) => {
  try {
    const id = event.context.params?.id
    const { signature } = await readBody(event)
    const auth = event.context.auth

    if (!id || !signature) {
      throw createError({
        statusCode: 400,
        message: 'ID et signature requis'
      })
    }

    const decompte = await Decompte.findById(id)
    if (!decompte) {
      throw createError({
        statusCode: 404,
        message: 'Décompte non trouvé'
      })
    }

    // Ajouter la signature avec horodatage
    decompte.signatures.push({
      user: auth.userId,
      date: new Date(),
      signature
    })

    // Mettre à jour le statut si nécessaire
    if (auth.role === 'signer') {
      decompte.status = 'signed'
    }

    await decompte.save()

    return {
      message: 'Signature ajoutée avec succès',
      decompte
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la signature du décompte'
    })
  }
})