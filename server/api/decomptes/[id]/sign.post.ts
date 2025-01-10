import { H3Event } from 'h3'
import { Decompte } from '../../../models/Decompte'
import { SignPDF } from '@signpdf/signpdf'
import { readFileSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event: H3Event) => {
  try {
    const id = event.context.params?.id
    const { signature, certificateInfo } = await readBody(event)
    const auth = event.context.auth
    
    const decompte = await Decompte.findById(id)
    if (!decompte) {
      throw createError({
        statusCode: 404,
        message: 'Décompte non trouvé'
      })
    }
    
    // Vérifier si l'utilisateur peut signer ce décompte
    if (!decompte.canBeSignedBy(auth.userId)) {
      throw createError({
        statusCode: 403,
        message: 'Vous n\'êtes pas autorisé à signer ce décompte'
      })
    }
    
    // Ajouter la signature avec les informations du certificat
    decompte.signatures.push({
      user: auth.userId,
      date: new Date(),
      signature,
      certificateInfo
    })
    
    // Mettre à jour le statut
    decompte.status = 'signed'
    
    await decompte.save()
    
    return decompte
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur lors de la signature du décompte'
    })
  }
})