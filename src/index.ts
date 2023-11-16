import dotenv from 'dotenv'
import server from './server'
import healthCheck from './routes/healthCheck'

dotenv.config()

const startServer = async () => {
    const port = Number(process.env.PORT) || 4002
    await server.start( Number(port))

    server.instance().use('/api/health-check', healthCheck())
}

startServer()
