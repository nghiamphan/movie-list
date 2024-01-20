const router = require('express').Router()
const { MovieList } = require('../models')
const { User } = require('../models')
const { tokenExtractor } = require('../util/middleware')

const findAttributes = {
    attributes: { exclude: ['userId'] },
    include: {
        model: User,
        as: 'user',
        attributes: ['id', 'username'],
    },
}

/*
 * GET /api/movieLists/default
 * GET /api/movieLists/public
 */
router.get(['/default', '/public'], async (req, res) => {
    const movieLists = await MovieList.findAll({
        where: {
            type: req.url.substring(1),
        },
        ...findAttributes,
        order: [['id', 'ASC']],
    })
    res.json(movieLists)
})

/*
 * Get all movies lists of the logged in user
 * GET /api/movieLists/private
 */
router.get('/private', tokenExtractor, async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)
    const movieLists = await MovieList.findAll({
        where: {
            userId: user.id,
        },
        ...findAttributes,
        order: [['id', 'ASC']],
    })
    res.json(movieLists)
})

/*
 * GET /api/movieLists/watchlist
 */
router.get(['/watchlist', '/watched'], tokenExtractor, async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)
    const movieLists = await MovieList.findOne({
        where: {
            userId: user.id,
            type: req.url.substring(1),
        },
        ...findAttributes,
    })
    res.json(movieLists)
})

/*
 * GET /api/movieLists/1
 */
router.get('/:id', async (req, res) => {
    const movieList = await MovieList.findByPk(req.params.id, findAttributes)

    if (movieList) {
        if (movieList.type === 'default' || movieList.type === 'public') {
            res.json(movieList)
        } else {
            tokenExtractor(req, res, async () => {
                const user = await User.findByPk(req.decodedToken.id)

                if (movieList.user.id === user.id) {
                    res.json(movieList)
                } else {
                    res.status(401).json({ error: 'Unauthorized' })
                }
            })
        }
    } else {
        res.status(404).end()
    }
})

/*
 * POST /api/movieLists
 * {
 *   "name": "My List",
 *   "imdbIdList": ["tt1234567", "tt7654321"],
 *   "userId": "1",
 *   "type": "private"
 * }
 */
router.post('/', tokenExtractor, async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)
    const movieList = await MovieList.create({ ...req.body, userId: user.id })
    res.json(movieList)
})

router.put('/:id', tokenExtractor, async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)
    const movieList = await MovieList.findByPk(req.params.id, findAttributes)

    if (movieList.user.id === user.id) {
        const updatedMovieList = await MovieList.update(req.body, {
            where: { id: req.params.id },
            returning: true,
        })
        res.json(updatedMovieList[1][0])
    } else {
        res.status(401).json({ error: 'Unauthorized' })
    }
})

router.delete('/:id', tokenExtractor, async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)
    const movieList = await MovieList.findByPk(req.params.id)

    if (movieList.userId === user.id) {
        await MovieList.destroy({ where: { id: req.params.id } })
        res.status(204).end()
    } else {
        res.status(401).json({ error: 'Unauthorized' })
    }
})

module.exports = router
