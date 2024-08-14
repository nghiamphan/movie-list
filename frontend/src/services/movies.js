import axios from 'axios'

const backendBaseUrl = '/api/movies'

/**
 * Search for movies by title or director or actor
 * @param {string} query
 */
const searchMovies = async (query) => {
    const url = `${backendBaseUrl}?query=${query}`

    const response = await axios.get(url)

    const movies = response.data

    return movies
}

/**
 * Advanced search for movies by various criteria
 * @param {Object} body - The body object containing movie filter criteria.
 * @param {string} body.title - The title of the movie.
 * @param {string} body.yearMin - The minimum year of release.
 * @param {string} body.yearMax - The maximum year of release.
 * @param {string} body.director - The director of the movie.
 * @param {string} body.actors - The actors in the movie.
 * @param {string} body.country - The country of origin.
 * @param {string} body.genre - The genre of the movie.
 * @param {string} body.notGenre - The genre to exclude.
 * @param {string} body.imdbVotesMin - The minimum number of IMDb votes.
 * @param {string} body.imdbVotesMax - The maximum number of IMDb votes.
 * @param {string} body.imdbRatingMin - The minimum IMDb rating.
 * @param {string} body.imdbRatingMax - The maximum IMDb rating.
 * @param {Array} body.inMovieLists - The lists in which the movie is included.
 */
const advancedSearchMovies = async (body) => {
    const url = `${backendBaseUrl}/advanced-search`

    const response = await axios.post(url, body)

    const movies = response.data
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

export default { searchMovies, advancedSearchMovies, getMoviesByImdbIds }
