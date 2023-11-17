import { PrismaClient } from "@prisma/client"
import express from "express"

const db = new PrismaClient()
const app = express()

const get = () => app

const start = (port: number): Promise<void> => {
    return new Promise((resolve) => {
        app.listen(port, () => {
            console.log(`Server is running at localhost:${port}`)
            resolve()
        })
    })
}

export default {
    instance: get,
    start,
    dbInstance: db
}