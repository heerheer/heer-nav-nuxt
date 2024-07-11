import type { EventHandler, EventHandlerRequest } from 'h3'

export const defineHandlerWithAuth = <T extends EventHandlerRequest, D>(
  handler: EventHandler<T, D>
): EventHandler<T, D> =>
  defineEventHandler<T>(async (event) => {

    try {
      let token = event.headers.get('Authorization')
      if (token != process.env.API_TOKEN) {
        //return 401
        setResponseStatus(event, 401)
        return {
          message: 'Unauthorized',
          code: 401,
          data: {}
        }
      }
      const response = await handler(event)
      return { response }
    } catch (err) {
      // Error handling
      return { err }
    }
  })
