// server/api/actors/index.post.ts

import { H3Event, EventHandlerRequest } from 'h3'
import { ActorModel } from '../../models/actors'

export default defineEventHandler(async (event) => {
  const body = await useBody(event)
  const actor = new ActorModel(body)
  await actor.save()
  return actor
})
function useBody(event: H3Event<EventHandlerRequest>) {
  throw new Error('Function not implemented.')
}

