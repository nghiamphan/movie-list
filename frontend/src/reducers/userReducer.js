import { createSlice } from '@reduxjs/toolkit'
import movieListService from '../services/movieLists'
import { LOGGGED_MOVIE_USER } from '../utils/config'
import logger from '../utils/logger'
import {
    fetchWatched,
    fetchWatchlist,
    setCurrentMovieList,
    setWatched,
    setWatchlist,
} from './movieListReducer'
import { fetchMovies } from './movieReducer'

/*
 * state: {
 *    id,
 *    username,
 * }
 */
const userReducer = createSlice({
    name: 'user',
    initialState: null,
    reducers: {
        setUser: (state, action) => action.payload,
    },
})

/**
 * Set the logged in user in the Redux store and local storage.
 * @param {Object} user
 * @param {string} user.token - The user token.
 * @param {string} user.id - The user id.
 * @param {string} user.username - The user username.
 */
export const login = (user) => {
    return async (dispatch) => {
        try {
            window.localStorage.setItem(LOGGGED_MOVIE_USER, JSON.stringify(user))
            movieListService.setToken(user.token)
            await dispatch(fetchWatchlist())
            await dispatch(fetchWatched())
            dispatch(setUser(user))

            logger.info('Login: ', LOGGGED_MOVIE_USER, user)
            return user
        } catch (error) {
            logger.error(error)
        }
    }
}

export const logout = () => {
    return async (dispatch) => {
        window.localStorage.removeItem(LOGGGED_MOVIE_USER)
        movieListService.setToken(null)
        dispatch(setUser(null))
        dispatch(setWatchlist({}))
        dispatch(setWatched({}))
        dispatch(setCurrentMovieList({}))
        dispatch(fetchMovies([]))

        logger.info('Logout: ', LOGGGED_MOVIE_USER, window.localStorage.getItem(LOGGGED_MOVIE_USER))
    }
}

export const { setUser } = userReducer.actions
export default userReducer.reducer
