import axios from 'axios'
import logger from '../utils/logger'

const backendBaseUrl = '/api/movies'
const omdbBaseUrl = `http://www.omdbapi.com/?apikey=${import.meta.env.VITE_API_KEY}&plot=full`

/*
    Process movie title: 'Train Has Stopped, The' -> 'The Train Has Stopped'
*/
const processTitle = (movieTitle) => {
    const match = /, ([aA]|the|The)$/.exec(movieTitle)
    if (match) {
        movieTitle = match[0].substring(2, match[0].length) + ' ' + movieTitle.substring(0, match.index)
    }
    return movieTitle
}

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

const getMovie = async (movieTitle, year, imdbId) => {
    if (imdbId) {
        const backendUrl = `${backendBaseUrl}/${imdbId}`
        const response = await axios.get(backendUrl)
        if (response.data) {
            logger.info('found movie in backend by imdbId', response.data)
            return response.data
        } else {
            const omdbUrl = `${omdbBaseUrl}&i=${imdbId}`
            const response = await axios.get(omdbUrl)
            if (response.data.Response !== 'False') {
                const movie = processBodyRequestOmdb(response)
                logger.info('found movie in omdb by imdbId', movie)

                try {
                    // save movie to backend
                    await axios.post(backendBaseUrl, movie)
                } catch (error) {
                    logger.error('error saving movie to backend', error)
                }

                return movie
            }
        }
    } else {
        movieTitle = processTitle(movieTitle)

        // first try to get movie from backend
        let backendUrl = `${backendBaseUrl}?title=${movieTitle}`
        backendUrl = year ? `${backendUrl}&year=${year}` : backendUrl

        let response = await axios.get(backendUrl)
        if (response.data) {
            logger.info('movie found in backend', response.data)
            return response.data
        }

        // if no movie found in backend, try to get it from omdb
        const omdbUrl = `${omdbBaseUrl}&t=${movieTitle}&y=${year}`

        response = await axios.get(omdbUrl)

        // if no movie found, try again without year
        if (response.data.Response === 'False' && year !== '') {
            response = await axios.get(omdbBaseUrl + `&t=${movieTitle}`)
        }

        if (response.data.Response !== 'False') {
            const movie = processBodyRequestOmdb(response)
            logger.info('movie found in omdb', movie)

            try {
                // save movie to backend
                await axios.post(backendBaseUrl, movie)
            } catch (error) {
                logger.error('error saving movie to backend', error)
            }

            return movie
        } else {
            return null
        }
    }
}

const getMovies = async (queries) => {
    queries = queries.split('\n')
    queries = queries.map((query) => query.split('\t'))

    const promiseArray = queries.map((query) => getMovie(query[0], query[1]))
    const response = await Promise.all(promiseArray)

    const movies = response.filter((movie) => movie !== null)
    return movies
}

const getMoviesByImdbIds = async (imdbIds) => {
    const url = `${backendBaseUrl}/search`

    const body = {
        imdbIds: imdbIds,
    }

    const response = await axios.post(url, body)

    const movies = response.data
    return movies
}

export default { getMovie, getMovies, getMoviesByImdbIds }
