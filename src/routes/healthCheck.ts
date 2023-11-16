import healthCheck from '../controllers/healthCheck'
import express from 'express'

const Router = express.Router();

export default () => {
    Router.get('/', healthCheck )
    return Router
}