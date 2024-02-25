/* eslint-disable quotes */
require('dotenv').config({ path: '../.env' })
const axios = require('axios')
const fs = require('fs')
const { Op } = require('sequelize')

const { Movie, MovieList } = require('../models')
const { connectToDatabase } = require('../util/db')
const { OMDB_API_KEY } = require('../util/config')
const logger = require('../util/logger')

const omdbBaseUrl = `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&plot=full`

const processBodyRequestOmdb = (response) => {
    const data = response.data

    let rottenTomatoesRating = data.Ratings.filter((rating) => rating['Source'] === 'Rotten Tomatoes')
    rottenTomatoesRating = rottenTomatoesRating.length > 0 ? rottenTomatoesRating[0]['Value'] : 'N/A'

    const movie = {
        imdbId: data.imdbID,
        title: data.Title,
        year: data.Year,
        rated: data.Rated,
        released: data.Released,
        runtime: data.Runtime,
        genre: data.Genre,
        director: data.Director,
        writer: data.Writer,
        actors: data.Actors,
        plot: data.Plot,
        language: data.Language,
        country: data.Country,
        awards: data.Awards,
        poster: data.Poster,
        metascore: data.Metascore,
        rottenTomatoesRating: rottenTomatoesRating,
        imdbRating: data.imdbRating,
        imdbVotes: data.imdbVotes,
        type: data.Type,
        dvd: data.DVD,
        boxOffice: data.BoxOffice,
        production: data.Production,
        website: data.Website,
    }
    return movie
}

const getMovie = async (imdbId) => {
    const response = await axios.get(`${omdbBaseUrl}&i=${imdbId}`)
    if (response.data.Response === 'False') {
        logger.error({ imdbId, error: response.data.Error })
        return
    }
    const movie = processBodyRequestOmdb(response)

    try {
        await Movie.create(movie)
    } catch (err) {
        logger.error(err)
    }

    return movie
}

const getMovies = async (file) => {
    const imdbIds = fs.readFileSync(file, 'utf8').split(/[\r]*\n/)

    // Find list of movies that are already in the database
    const returnedMovies = await Movie.findAll({
        attributes: ['imdbId'],
        where: {
            imdbId: {
                [Op.in]: imdbIds,
            },
        },
    })
    const returnedImdbIds = returnedMovies.map((movie) => movie.imdbId)
    // Find list of movies that are not in the database
    const notFoundImdbIds = imdbIds.filter((imdbId) => !returnedImdbIds.includes(imdbId))

    // Get movies from OMDB API
    try {
        await Promise.all(notFoundImdbIds.map((imdbId) => getMovie(imdbId)))
    } catch (err) {
        if (err.response && err.response.data) {
            logger.error(err.name, err.response.data)
        } else {
            logger.error(err)
        }
    }
    return imdbIds
}

const updateMovies = async () => {
    await Movie.update(
        {
            inMovieLists: [],
        },
        { where: {} }
    )

    const movieLists = await MovieList.findAll({
        where: {
            type: 'default',
        },
        order: [['id', 'ASC']],
        raw: true,
    })

    for (const movieList of movieLists) {
        const imdbIds = movieList.imdbIds
        for (const imdbId of imdbIds) {
            const movie = await Movie.findByPk(imdbId)
            if (movie) {
                movie.inMovieLists = movie.inMovieLists.concat(movieList.name)
                await movie.save()
            }
        }
    }
}

const createDefaultList = async (file, name, index) => {
    const imdbIds = await getMovies(file)

    // Insert or update movie list
    const movieList = await MovieList.findByPk(index)

    if (!movieList) {
        await MovieList.create({
            id: index,
            name,
            imdbIds,
            type: 'default',
        })
    } else {
        MovieList.update(
            {
                name,
                imdbIds,
                type: 'default',
            },
            {
                where: {
                    id: index,
                },
            }
        )
    }
}

const main = async () => {
    await connectToDatabase()

    const list = [
        { file: 'Criterion Collection.txt', name: 'Criterion Collection' },
        { file: 'AFI 100 Movies (1998).txt', name: 'AFI 100 Movies (1998)' },
        {
            file: 'AFI 100 Movies 10th Anniversary (2007).txt',
            name: 'AFI 100 Movies 10th Anniversary (2007)',
        },
        { file: 'AFI 100 Laughs (2000).txt', name: 'AFI 100 Laughs (2000)' },
        { file: 'AFI 100 Thrills (2001).txt', name: 'AFI 100 Thrills (2001)' },
        { file: 'AFI 100 Passions (2002).txt', name: 'AFI 100 Passions (2002)' },
        { file: 'AFI 100 Cheers (2006).txt', name: 'AFI 100 Cheers (2006)' },
        { file: 'AFI 25 Musicals (2006).txt', name: 'AFI 25 Musicals (2006)' },
        { file: 'AFI 10 Top 10 (2008).txt', name: 'AFI 10 Top 10 (2008)' },
        { file: 'National Film Registry.txt', name: 'National Film Registry' },
        { file: 'BFI Sight and Sound Top 250 (2022).txt', name: 'BFI Sight & Sound Top 250 (2022)' },
        { file: 'BFI 100 British Films (1999).txt', name: 'BFI 100 British Films (1999)' },
        { file: '100 Italian Films to be saved (2008).txt', name: '100 Italian Films to be saved (2008)' },
        { file: 'TSPDT Top 1000 (2024).txt', name: "They Shoot Pictures, Don't They? Top 1000 (2024)" },
        { file: 'TSPDT 1001-2500 (2024).txt', name: "They Shoot Pictures, Don't They? 1001-2500 (2024)" },
        { file: 'TSPDT 2501-5000 (2024).txt', name: "They Shoot Pictures, Don't They? 2501-5000 (2024)" }, // Missing 3 films
    ]

    list.map(async ({ file, name }, index) => {
        await createDefaultList(file, name, index + 1)
    })

    await getMovies('Extra Movies.txt')

    updateMovies()
}

main()
