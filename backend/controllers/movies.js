const router = require('express').Router()
const { Op, Sequelize, literal } = require('sequelize')
const { Movie } = require('../models')
const { sequelize } = require('../util/db')

const movieFinder = async (req, res, next) => {
    req.movie = await Movie.findByPk(req.params.id)
    next()
}

/*
 * GET /api/movies
 * GET /api/movies?title=brave
 * GET /api/movies?title=brave&year=2012
 * GET /api/movies?query=brave
 */
router.get('/', async (req, res) => {
    if (Object.keys(req.query).length === 0) {
        const movies = await Movie.findAll()
        res.json(movies)
    } else if (req.query.title) {
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
    } else if (req.query.query) {
        const query = req.query.query.toLowerCase()
        const rawMovies = await sequelize.query(
            `
            SELECT * FROM Movies
            WHERE LOWER(title) LIKE '%${query}%' OR LOWER(director) LIKE '%${query}%' OR LOWER(actors) LIKE '%${query}%'
            ORDER BY
                CASE
                    WHEN LOWER(title) = '${query}' THEN 1
                    WHEN LOWER(title) LIKE '%${query}%' THEN 2
                    WHEN LOWER(director) = '${query}' OR LOWER(actors) = '${query}' THEN 3
                    WHEN LOWER(director) LIKE '%${query}%' OR LOWER(actors) LIKE '%${query}%' THEN 4
                END,
                CASE
                    WHEN imdb_votes IS NOT NULL AND imdb_votes != 'N/A' THEN CAST(REPLACE(imdb_votes, ',', '') AS INT)
                    ELSE 0
                END DESC
            LIMIT 100
            `,
            { type: Sequelize.QueryTypes.SELECT }
        )

        const movies = rawMovies.map((movie) => ({
            ...movie,
            imdbId: movie.imdb_id,
            rottenTomatoesRating: movie.rotten_tomatoes_rating,
            imdbRating: movie.imdb_rating,
            imdbVotes: movie.imdb_votes,
            boxOffice: movie.box_office,
            inMovieLists: movie.in_movie_lists,
        }))
        res.json(movies)
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
 * POST /api/movies/advanced-search
 * {
 *   "title": "Brazil",
 *   "yearMin": 1950,
 *   "yearMax": 2012,
 *   "director": "Terry Gilliam",
 *   "actors": "Jonathan Pryce",
 *   "country": "United States",
 *   "genre": "Drama",
 *   "notGenre": "Documentary",
 *   "imdbVotesMin": "10000",
 *   "imdbVotesMax": "20000",
 *   "imdbRatingMin": "7",
 *   "imdbRatingMax": "8",
 *   "inMovieLists": ["Criterion Collection", "BFI 100 British Films (1999)"]
 * }
 */
router.post('/advanced-search', async (req, res) => {
    const whereCondition = {}

    // Add title condition
    if (req.body.title) {
        whereCondition.title = {
            [Op.iLike]: `%${req.body.title}%`,
        }
    }

    // Add year condition
    if (req.body.yearMin) {
        whereCondition.year = {
            [Op.ne]: 'N/A',
            [Op.gte]: req.body.yearMin,
        }
    }
    if (req.body.yearMax) {
        whereCondition.year = {
            ...whereCondition.year,
            [Op.ne]: 'N/A',
            [Op.lte]: req.body.yearMax,
        }
    }

    // Add director condition
    if (req.body.director) {
        whereCondition.director = {
            [Op.iLike]: `%${req.body.director}%`,
        }
    }

    // Add actors condition
    if (req.body.actors) {
        whereCondition.actors = {
            [Op.iLike]: `%${req.body.actors}%`,
        }
    }

    // Add country condition
    if (req.body.country) {
        whereCondition.country = {
            [Op.iLike]: `%${req.body.country}%`,
        }
    }

    // Add genre condition
    if (req.body.genre) {
        whereCondition.genre = {
            [Op.iLike]: `%${req.body.genre}%`,
        }
    }
    if (req.body.notGenre) {
        whereCondition.genre = {
            ...whereCondition.genre,
            [Op.notILike]: `%${req.body.notGenre}%`,
        }
    }

    // Add imdbVotes condition
    if (req.body.imdbVotesMin) {
        const imdbVotesMin = parseInt(req.body.imdbVotesMin, 10)
        whereCondition.imdbVotes = {
            [Op.and]: [
                { [Op.ne]: 'N/A' },
                literal(`CAST(REPLACE(imdb_votes, ',', '') AS INTEGER) >= ${imdbVotesMin}`),
            ],
        }
    }
    if (req.body.imdbVotesMax) {
        const imdbVotesMax = parseInt(req.body.imdbVotesMax)
        whereCondition.imdbVotes = {
            ...whereCondition.imdbVotes,
            [Op.and]: [
                ...(whereCondition.imdbVotes[Op.and] || [{ [Op.ne]: 'N/A' }]),
                literal(`CAST(REPLACE(imdb_votes, ',', '') AS INTEGER) <= ${imdbVotesMax}`),
            ],
        }
    }

    // Add imdbRating condition
    if (req.body.imdbRatingMin) {
        const imdbRatingMin = parseFloat(req.body.imdbRatingMin, 0)
        whereCondition.imdbRating = {
            [Op.and]: [{ [Op.ne]: 'N/A' }, literal(`CAST(imdb_rating AS FLOAT) >= ${imdbRatingMin}`)],
        }
    }
    if (req.body.imdbRatingMax) {
        const imdbRatingMax = parseFloat(req.body.imdbRatingMax, 10)
        whereCondition.imdbRating = {
            ...whereCondition.imdbRating,
            [Op.and]: [
                ...(whereCondition.imdbRating[Op.and] || [{ [Op.ne]: 'N/A' }]),
                literal(`CAST(imdb_rating AS FLOAT) <= ${imdbRatingMax}`),
            ],
        }
    }

    // Add movie list condition
    if (req.body.inMovieLists) {
        whereCondition.inMovieLists = {
            [Op.contains]: req.body.inMovieLists,
        }
    }

    const movies = await Movie.findAll({
        where: whereCondition,
        limit: 100,
    })

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
