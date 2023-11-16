import express from "express"
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = process.env.PORT || 4002

app.get('/api/health-check', (_,res) => {
    res.send('OK')
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})
