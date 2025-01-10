// server/api/actors/[id].delete.ts

import { ActorModel } from '../../models/actors'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const { id } = event.context.params ?? {}
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID is required'
    })
  }
  await ActorModel.findByIdAndDelete(id)
  return { message: 'Acteur supprimé' }
})
