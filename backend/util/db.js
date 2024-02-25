const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')
const logger = require('./logger')

const sequelize = new Sequelize(DATABASE_URL, { logging: false })

const connectToDatabase = async () => {
    try {
        await sequelize.authenticate()
        logger.info('Connection to the database has been established successfully.')
    } catch (error) {
        logger.error('Unable to connect to the database:', error)
        return process.exit(1)
    }
}

module.exports = { connectToDatabase, sequelize }
