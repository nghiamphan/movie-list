import axios from 'axios'

const backendBaseUrl = '/api/movies'

const searchMovies = async (query) => {
    const url = `${backendBaseUrl}?query=${query}`

    const response = await axios.get(url)

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

export default { searchMovies, getMoviesByImdbIds }
