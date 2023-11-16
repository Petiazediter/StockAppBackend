import express from "express"

const getStockBySymbol = async ( req: express.Request, res: express.Response ) => {
    const symbol = req.params.symbol;

    res.status(200)
        .json({
            message: `Stock with symbol: ${symbol}!`
        })
}

export default {
    getStockBySymbol
}