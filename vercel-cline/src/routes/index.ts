import express from 'express'
import gitRouter from './git/index.js'

const apiRouter = express.Router()


apiRouter.use('/git', gitRouter)



export default apiRouter