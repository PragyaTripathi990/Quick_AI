import serverless from 'serverless-http'
import app from '../server/server.js'

export const config = { runtime: 'nodejs20' }
export default serverless(app)


