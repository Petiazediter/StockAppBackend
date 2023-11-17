import cron from 'node-cron'
import server from '../server';
import ensureValidSymbol from '../utils/ensureValidSymbol';
import axios from 'axios';

const run = async () => {
    const stocks = await server.dbInstance.stock.findMany()

    stocks.forEach( async (stock) => {

        const { symbol } = stock
        
        try {
            await ensureValidSymbol(symbol) // just to be sure

            const { data, status } = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}`, {
                headers: {
                    'X-Finnhub-Token': process.env.STOCK_API_KEY || ''
                }
            })

            if ( status === 200 ) {
                const { c } = data
                await server.dbInstance.stock.update({
                    where: {
                        symbol
                    },
                    data: {
                        recordedPrices: {
                            create: {
                                price: c
                            }
                        }
                    }
                })

                console.log(`Successfully recorded price for ${symbol}.`)
                const recordedStockPrices = await server.dbInstance.stock.findUnique({
                    where: {
                        symbol
                    },
                    select: {
                        _count: {
                            select: {
                                recordedPrices: true
                            },
                        },
                    }
                })

                const count = recordedStockPrices?._count.recordedPrices
                if ( count && count > 10 ) {
                    server.dbInstance.recordedStockPrice.findMany({
                        where: {
                            stock: {
                                symbol
                            }
                        },
                        orderBy: {
                            recordedAt: 'asc'
                        },
                        take: count - 10,
                        select: {
                            id: true
                        }
                    }).then(idsToDelete => {
                        idsToDelete.forEach( ({id}) => server.dbInstance.recordedStockPrice.delete({
                            where: {
                                id
                            }
                        }))
                    })
                }
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