// server/api/actors/[id].put.ts

import { H3Event, EventHandlerRequest, readBody } from 'h3'
import { ActorModel } from '~/server/models/actors'

export default defineEventHandler(async (event) => {
  const { id } = event.context.params ?? {}
  const body = await useBody(event)
  const actor = await ActorModel.findByIdAndUpdate(id, body, { new: true }).lean()
  return actor
})

function useBody(event: H3Event<EventHandlerRequest>) {
  return readBody(event)
}
