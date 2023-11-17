import express from 'express'
import stockControllers from '../controllers/stock'

const Router = express.Router()

export default () => {
    Router.get('/:symbol', stockControllers.getStockBySymbol)
    Router.put('/:symbol', stockControllers.recordStockPrice)
    return Router
}