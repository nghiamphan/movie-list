const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const logger = require('./util/logger')
const middleware = require('./util/middleware')

const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(express.static('dist'))

const movieRouter = require('./controllers/movies')
const movieListRouter = require('./controllers/movieLists')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

app.use('/api/movies', movieRouter)
app.use('/api/movieLists', movieListRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

const start = async () => {
    await connectToDatabase()
    app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`)
    })
}

start()
