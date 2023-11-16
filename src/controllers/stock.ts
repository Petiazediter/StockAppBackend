import express from "express"
import axios from 'axios'
import ensureValidSymbol from "../utils/ensureValidSymbol";


const getStockBySymbol = async ( req: express.Request, res: express.Response ) => {
    const symbol = req.params.symbol;

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

export default {
    getStockBySymbol
}