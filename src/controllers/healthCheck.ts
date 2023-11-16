import express from "express"

const getHealthCheck = async ( _req: express.Request, res: express.Response ) => {
    res.sendStatus(200)
}

export default getHealthCheck