import axios from "axios"
import server from "../server"

interface SearchResults {
    count: number
    result: Record<string, any>[]
    error?: string
}

const headers = {
    'X-Finnhub-Token': process.env.STOCK_API_KEY  || ''
}

const getAllStocksFromDB = async () => {
    return server.dbInstance.stock.findMany()
}

const getStockBySymbol = async (symbol: string) => {
    return Promise.all([
        axios.get(`https://www.finnhub.io/api/v1/quote?symbol=${symbol}`, {
            headers
        }),
        server.dbInstance.stock.findUnique({
            where: {
                symbol
            }
        }) 
    ])
}

const getStocksBySymbol = async (symbol: string) => {
    return axios.get<SearchResults>(`https://www.finnhub.io/api/v1//search?q=${symbol}`, {
        headers
    })
}

const getStockDetailsBySymbol = async (symbol: string) => {
    return Promise.all([
        server.dbInstance.recordedStockPrice.aggregate({
            where: {
                stock: {
                    symbol
                }
            },
            _avg: {
                price: true
            },
            orderBy: {
                price: 'desc'
            },
            take: 10,
            _count: true
        }),
        server.dbInstance.recordedStockPrice.findFirst({
            where: {
                stock: {
                    symbol
                }
            },
            orderBy: {
                recordedAt: 'desc'
            },
            select: {
                recordedAt: true
            }
        }),
    ])
}

const recordExistingPrice = async (symbol: string, price: number) => {
    try {
        return server.dbInstance.stock.update({
            where: {
                symbol
            }, 
            data: {
                recordedPrices: {
                    create: {
                        price
                    }
                }
            }
        })
    } catch (e) {
        throw e
    }
}

const recordNewStockPrice = async (symbol: string) => {
    return server.dbInstance.stock.create({
        data: {
            symbol
        }
    })
}

const fetchRecordedPricesCount = async (symbol: string) => {
    return server.dbInstance.stock.findUnique({
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
}

const deleteOldRecordedPrices = async (symbol: string): Promise<void> => {
    return new Promise( resolve => {
        fetchRecordedPricesCount(symbol).then((recordedStockPrice) => {
            const count = recordedStockPrice?._count.recordedPrices
            if ( count && count > 10 ) {
                console.log('Recorded count: ', count)
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
                        console.log(`Deleting ${idsToDelete.length} old recorded prices for ${symbol}.`)
                        Promise.all(idsToDelete.map( ({id}) => server.dbInstance.recordedStockPrice.delete({
                            where: {
                                id
                            }
                        }).then( () => resolve())
                    ))
                })
            }
        })
    })
}

export default {
    getAllStocksFromDB,
    getStockBySymbol,
    getStocksBySymbol,
    getStockDetailsBySymbol,
    recordPrice: recordExistingPrice,
    createStockPriceRecording: recordNewStockPrice,
    deleteOldRecordedPrices
}