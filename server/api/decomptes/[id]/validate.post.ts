import { H3Event } from 'h3'
import { Decompte } from '../../../models/Decompte'

export default defineEventHandler(async (event: H3Event) => {
  try {
    const id = event.context.params?.id
    const { status, comments } = await readBody(event)
    const auth = event.context.auth
    
    if (!['approved', 'rejected'].includes(status)) {
      throw createError({
        statusCode: 400,
        message: 'Statut de validation invalide'
      })
    }
    
    const decompte = await Decompte.findById(id)
    if (!decompte) {
      throw createError({
        statusCode: 404,
        message: 'Décompte non trouvé'
      })
    }
    
    // Vérifier si l'utilisateur peut valider ce décompte
    if (!decompte.canBeValidatedBy(auth.userId)) {
      throw createError({
        statusCode: 403,
        message: 'Vous n\'êtes pas autorisé à valider ce décompte'
      })
    }
    
    // Mettre à jour l'étape actuelle du workflow
    const currentStep = decompte.workflow.steps[decompte.workflow.currentStep]
    currentStep.status = status
    currentStep.date = new Date()
    currentStep.comments = comments
    
    // Ajouter la validation
    decompte.validations.push({
      user: auth.userId,
      date: new Date(),
      status,
      comments
    })
    
    // Mettre à jour le statut global si nécessaire
    if (status === 'approved') {
      if (decompte.workflow.currentStep === decompte.workflow.steps.length - 1) {
        decompte.status = 'pending_signature'
      } else {
        decompte.workflow.currentStep += 1
        decompte.status = 'pending_validation'
      }
    } else {
      decompte.status = 'rejected'
    }
    
    await decompte.save()
    
    return decompte
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur lors de la validation du décompte'
    })
  }
})