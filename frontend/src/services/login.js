import axios from 'axios'

const baseUrl = '/api/login'

/**
 * @param {Object} credentials
 * @param {string} credentials.username - The username.
 * @param {string} credentials.password - The password.
 */
const login = async (credentials) => {
    const response = await axios.post(baseUrl, credentials)
    return response.data
}

export default { login }
