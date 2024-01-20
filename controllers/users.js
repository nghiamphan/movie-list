const bcrypt = require('bcrypt')
const router = require('express').Router()
const { User, MovieList } = require('../models')
const { tokenExtractor } = require('../util/middleware')

const findAttributes = {
    attributes: ['id', 'username'],
    raw: true,
}

router.get('/', async (req, res) => {
    const users = await User.findAll(findAttributes)
    res.json(users)
})

router.get('/:id', async (req, res) => {
    const user = await User.findByPk(req.params.id, findAttributes)
    if (user) {
        res.json(user)
    } else {
        res.status(404).end()
    }
})

/*
 * POST /api/users
 * {
 *    username: 'username',
 *    password: 'password'
 * }
 */
router.post('/', async (req, res) => {
    const { username, password } = req.body

    const existingUser = await User.findOne({
        where: {
            username: username,
        },
    })
    if (existingUser) {
        res.status(400).json({ error: 'Username already exists' })
        return
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = {
        username,
        passwordHash: passwordHash,
    }

    const createdUser = await User.create(user)
    await MovieList.bulkCreate([
        {
            name: `${createdUser.username}'s watchlist`,
            type: 'watchlist',
            userId: createdUser.id,
        },
        {
            name: `${createdUser.username}'s watch history`,
            type: 'watched',
            userId: createdUser.id,
        },
    ])
    res.json(createdUser)
})

/*
 * PUT /api/users/1
 * {
 *    username: 'username',
 *    password: 'password'
 * }
 */
router.put('/:id', tokenExtractor, async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)

    const { username, password } = req.body
    if (user && user.id === Number(req.params.id)) {
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        user.username = username
        user.passwordHash = passwordHash

        await user.save()
        res.json(user)
    } else {
        res.status(404).end()
    }
})

router.delete('/:id', tokenExtractor, async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)
    if (user && user.id === Number(req.params.id)) {
        await MovieList.destroy({
            where: {
                userId: user.id,
            },
        })
        await User.destroy({
            where: {
                id: user.id,
            },
        })
        res.status(204).end()
    } else {
        res.status(404).end()
    }
})

module.exports = router
