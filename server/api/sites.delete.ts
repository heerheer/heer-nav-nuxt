export default defineEventHandler<{
  body: {
    name: string
  }
}>(async (event) => {
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

  const { name } = await readBody(event)



})
