import express from "express"

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
    start
}