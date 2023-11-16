import express from 'express'
import stockControllers from '../controllers/stock'

const Router = express.Router()

export default () => {
    Router.get('/:symbol', stockControllers.getStockBySymbol)
    return Router
}