import axios from 'axios'
import { LOGGGED_MOVIE_USER } from '../utils/config'

const baseUrl = '/api/users'

const create = async (user) => {
    const response = await axios.post(baseUrl, user)
    return response.data
}

const update = async (user) => {
    const loggedUserJSON = window.localStorage.getItem(LOGGGED_MOVIE_USER)

    if (loggedUserJSON) {
        const loggedUser = JSON.parse(loggedUserJSON)
        const config = {
            headers: { Authorization: `bearer ${loggedUser.token}` },
        }
        const url = `${baseUrl}/${loggedUser.id}`

        const response = await axios.put(url, user, config)
        return response.data
    }
    return null
}

export default { create, update }
