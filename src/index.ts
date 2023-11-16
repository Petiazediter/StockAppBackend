import dotenv from 'dotenv'
import server from './server'

dotenv.config()

const startServer = async () => {
    const port = Number(process.env.PORT) || 4002
    await server.start( Number(port))
    server.instance().get('/api/health-check', (_,res) => {
        res.sendStatus(200)
    })
}

startServer()
