const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const { User } = require('../models')

router.post('/', async (req, res) => {
    const { username, password } = req.body

    const user = await User.findOne({
        where: {
            username: username,
        },
    })

    const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        return res.status(401).json({
            error: 'Invalid username or password',
        })
    }

    const userForToken = {
        username: user.username,
        id: user.id,
    }

    const token = jwt.sign(userForToken, SECRET, { expiresIn: 60 * 60 * 24 * 7 })

    res.status(200).send({ token, id: user.id, username: user.username, watched: user.watched })
})

module.exports = router
