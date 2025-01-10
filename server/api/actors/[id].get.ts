// server/api/actors/[id].get.ts

import { ActorModel } from '~/server/models/actors'

export default defineEventHandler(async (event) => {
  const { id } = event.context.params ?? {}
  const actor = await ActorModel.findById(id).lean()
  return actor
})
