import express from "express"
import ensureValidSymbol from "../utils/ensureValidSymbol";
import stockService from "../services/stock";

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
    
    const [{ data, status}, stock ] = await stockService.getStockBySymbol(symbol)

     if ( !stock ) {
        return res.status(404)
            .json({
                error: 'Couldn\'t find recorded prices for this stock. Please use PUT /stock/:symbol to record prices.'
            })
    }

    if ( status === 200 ) {
        const [stockPrices, lastRecorded] = await stockService.getStockDetailsBySymbol(symbol)

        return res.status(200)
            .json({
                currentPrice: data.c,
                movingAvg: stockPrices._avg.price,
                lastRecordedAt: lastRecorded?.recordedAt,
                warningMsg: stockPrices._count < 10 && 'There is no 10 recorded prices yet. Please wait for a while.'
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

    const [_api, stock] = await stockService.getStockBySymbol(symbol)
    const alreadyExists = stock !== null

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
        await stockService.createStockPriceRecording(symbol)
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