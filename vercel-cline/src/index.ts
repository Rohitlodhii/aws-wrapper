import express from 'express'
import cors from 'cors'
import apiRouter from './routes/index.js'
import { redisClient } from './lib/redis.js'

const app = express()

app.use(express.json())
app.use(cors())

app.get('/status',(req ,res)=>{
    res.send("Server Running ")
})
app.use('/api',apiRouter)


async function startServer() {
  try {
    await redisClient.connect()
    console.log('Redis connected')

    app.listen(3000, () => {
      console.log('App Started at port 3000')
    })
  } catch (err) {
    console.error('Failed to start server', err)
    process.exit(1)
  }
}

startServer()