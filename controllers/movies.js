const router = require('express').Router()
const { Op } = require('sequelize')
const { Movie } = require('../models')

const movieFinder = async (req, res, next) => {
    req.movie = await Movie.findByPk(req.params.id)
    next()
}

/*
 * GET /api/movies
 * GET /api/movies?title=brave
 * GET /api/movies?title=brave&year=2012
 */
router.get('/', async (req, res) => {
    if (!req.query.title) {
        const movies = await Movie.findAll()
        res.json(movies)
    } else {
        const whereCondition = {
            title: {
                [Op.iLike]: req.query.title,
            },
        }
        if (req.query.year) {
            whereCondition.year = req.query.year
        }
        const movie = await Movie.findOne({ where: whereCondition })
        res.json(movie)
    }
})

/*
 * GET /api/movies/tt1217209
 */
router.get('/:id', movieFinder, async (req, res) => {
    if (req.movie) {
        res.json(req.movie)
    } else {
        res.status(404).end()
    }
})

/*
 * POST /api/movies/search
 * {
 *   "imdbIds": ["tt1217209", "tt0112573"]
 * }
 */
router.post('/search', async (req, res) => {
    const whereCondition = {
        imdbId: {
            [Op.in]: req.body.imdbIds,
        },
    }

    const movies = await Movie.findAll({ where: whereCondition })

    // sort movies by order of req.body.imdbIds
    const imdbIdToIndex = {}
    for (let i = 0; i < req.body.imdbIds.length; i++) {
        imdbIdToIndex[req.body.imdbIds[i]] = i
    }

    for (let movie of movies) {
        movie.dataValues.index = imdbIdToIndex[movie.imdbId]
    }

    movies.sort((a, b) => a.dataValues.index - b.dataValues.index)

    res.json(movies)
})

/*
 * POST /api/movies
 * {
 *   "imdbId": "tt1217209",
 *   "title": "Brave",
 *   "year": 2012,
 *   "poster": "https://someurl.com/poster.jpg"
 * }
 */
router.post('/', async (req, res) => {
    const existingMovie = await Movie.findByPk(req.body.imdbId)
    if (existingMovie) {
        res.json(existingMovie)
        return
    }

    const movie = await Movie.create(req.body)
    res.json(movie)
})

router.put('/:id', movieFinder, async (req, res) => {
    if (req.movie) {
        await req.movie.save()
        res.json(req.movie)
    } else {
        res.status(404).end()
    }
})

router.delete('/:id', movieFinder, async (req, res) => {
    if (req.movie) {
        await req.movie.destroy()
    }
    res.status(204).end()
})

module.exports = router
