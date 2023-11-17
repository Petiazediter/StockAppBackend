import express from "express"
import axios from 'axios'
import ensureValidSymbol from "../utils/ensureValidSymbol";
import server from "../server";


const getStockBySymbol = async ( req: express.Request, res: express.Response ) => {
    const symbol = req.params.symbol;

    const stock = await server.dbInstance.stock.findUnique({
        where: {
            symbol
        }
    })

    if ( !stock ) {
        return res.status(404)
            .json({
                error: 'Couldn\'t find recorded prices for this stock. Please use PUT /stock/:symbol to record prices.'
            })
    }

    try {
        await ensureValidSymbol(symbol)
    } catch (e) {
        return res.status(404)
            .json({
                error: 'Symbol not found.'
            })
    }

    const { data, status } = await axios.get(`https://www.finnhub.io/api/v1/quote?symbol=${symbol}`, {
        headers: {
            'X-Finnhub-Token': process.env.STOCK_API_KEY  || ''
        }
    })

    console.log(JSON.stringify(data))

    if ( status === 200 ) {
        return res.status(200)
            .json({
                currentPrice: data.c,
            })
    } else {
        res.status(status)
            .json({
                error: 'Error fetching stock price'
            })
    }
}

const recordStockPrice = async ( req: express.Request, res: express.Response ) => {
    const symbol = req.params.symbol;

    const alreadyExists = (await server.dbInstance.stock.findUnique({
        where: {
            symbol
        }
    })) !== null

    if ( alreadyExists ) {
        return res.status(400)
            .json({
                error: 'Stock already recording daily. Please use GET /stock/:symbol to access the recorded data.'
            })
    }

    try {
        await ensureValidSymbol(symbol)
    } catch (e) {
        return res.status(404)
            .json({
                error: 'Symbol not found.'
            })
    }

    try {
        await server.dbInstance.stock.create({
            data: {
                symbol,
            }
        })

        res.status(200)
            .json({
                message: 'Successfully started recording stock price. Please use GET /stock/:symbol to access the recorded data.',
            })
    } catch (e) {
        res.status(500)
            .json({
                error: 'Error occurred while recording stock price.',
                detailedError: e
            })
    }
}

export default {
    getStockBySymbol,
    recordStockPrice
}