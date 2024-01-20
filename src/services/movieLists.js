import axios from 'axios'

const baseUrl = '/api/movieLists'

let token = null
const setToken = (newToken) => {
    token = `bearer ${newToken}`
}

const getDefaultMovieLists = async () => {
    const url = `${baseUrl}/default`
    const response = await axios.get(url)
    return response.data
}

const getWatchlist = async () => {
    const url = `${baseUrl}/watchlist`
    const config = {
        headers: { Authorization: token },
    }

    const response = await axios.get(url, config)
    return response.data
}

const getWatched = async () => {
    const url = `${baseUrl}/watched`
    const config = {
        headers: { Authorization: token },
    }

    const response = await axios.get(url, config)
    return response.data
}

const create = async (movieList) => {
    const config = {
        headers: { Authorization: token },
    }
    const response = await axios.post(baseUrl, movieList, config)
    return response.data
}

/*
 * movieList: {
 *    id,
 *    name,
 *    imdbIds: [imdbId, imdbId, ...],
 *    userId,
 *    type,
 * }
 */
const update = async (movieList) => {
    const config = {
        headers: { Authorization: token },
    }
    const url = `${baseUrl}/${movieList.id}`
    const response = await axios.put(url, movieList, config)
    return response.data
}

export default { setToken, getDefaultMovieLists, getWatchlist, getWatched, create, update }
