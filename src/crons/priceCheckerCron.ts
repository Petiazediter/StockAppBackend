import cron from 'node-cron'
import ensureValidSymbol from '../utils/ensureValidSymbol';
import stockService from '../services/stock';

const run = async () => {
    const stocks = await stockService.getAllStocksFromDB()

    stocks.forEach( async (stock) => {
        const { symbol } = stock
        try {
            await ensureValidSymbol(symbol) // just to be sure

            const [{ data, status }] = await stockService.getStockBySymbol(symbol)

            if ( status === 200 ) {
                const { c } = data
                await stockService.recordPrice(symbol, c)
                console.log(`Successfully recorded price for ${symbol}.`)
                stockService.deleteOldRecordedPrices(symbol)
            }
        } catch (e) {
            console.error(`Error occurred while fetching stock price for ${symbol}.`)
            console.error(e)
        }
    })
}

const schedule = () => cron.schedule('* * * * *', () => run());

export default {
    run,
    schedule
}