import dotenv from 'dotenv'
import server from './server'
import healthCheck from './routes/healthCheck'
import stock from './routes/stock'
import priceCheckerCron from './crons/priceCheckerCron'

dotenv.config()

const startServer = async () => {
    const port = Number(process.env.PORT) || 4002
    await server.start( Number(port))

    priceCheckerCron.schedule()

    server.instance().use('/api/health-check', healthCheck())
    server.instance().use('/stock', stock())
}

startServer()
