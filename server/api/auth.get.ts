
import 'dotenv/config'

export default defineEventHandler<{ query: { token: string } }>((event) => {
    let token = getQuery(event).token

    if (token == process.env.API_TOKEN) {
        return {
            message: 'OK',
            code: 200
        }
    }
    //return 401
    setResponseStatus(event, 401)
    return { message: 'Unauthorized', code: 401 }

})