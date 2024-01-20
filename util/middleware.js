const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const logger = require('./logger')

const requestLogger = (request, response, next) => {
    logger.info('\n--------- REQUEST LOG START ---------')
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.url)
    logger.info('Body:  ', request.body)
    logger.info('--------- REQUEST LOG END -----------\n')
    next()
}

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
        logger.info('decoded token', req.decodedToken)
    } else {
        res.status(401).json({ error: 'Missing token' })
        return
    }
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    logger.error('Error:', error.message)

    if (error.name === 'SequelizeUniqueConstraintError') {
        response.status(400).json({
            error_name: error.name,
            error: error.message,
        })
    } else if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
        response.status(401).json({
            error_name: error.name,
            error: error.message,
        })
    } else {
        response.status(400).json({
            error_name: error.name,
            error: error.message,
        })
    }
    next(error)
}

module.exports = {
    requestLogger,
    tokenExtractor,
    unknownEndpoint,
    errorHandler,
}
