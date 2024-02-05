import { createSlice } from '@reduxjs/toolkit'
import movieService from '../services/movies'

/*
 * state: [movieObject, movieObject, ...]
 */
const movieSearchReducer = createSlice({
    name: 'movies',
    initialState: [],
    reducers: {
        setMovies: (state, action) => action.payload,
        addMovies: (state, action) => [...state, ...action.payload],
    },
})

export const searchMovies = (query) => {
    return async (dispatch) => {
        const movies = await movieService.searchMovies(query)
        dispatch(setMovies(movies))
    }
}

// fetch the first 100 movies
export const fetchMovies = (imdbIds) => {
    return async (dispatch) => {
        if (!imdbIds || imdbIds.length === 0) {
            dispatch(setMovies([]))
            return
        }

        if (imdbIds.length > 100) {
            imdbIds = imdbIds.slice(0, 100)
        }
        const movies = await movieService.getMoviesByImdbIds(imdbIds)
        dispatch(setMovies(movies))
    }
}

// fetch the next 100 movies
export const fetchAdditionalMovies = () => {
    return async (dispatch, getState) => {
        const currentMovieList = getState().movieList.currentMovieList
        const currentMovies = getState().movies

        if (currentMovieList.imdbIds && currentMovieList.imdbIds.length > currentMovies.length) {
            let imdbIds = currentMovieList.imdbIds.slice(currentMovies.length, currentMovies.length + 100)
            if (imdbIds.length > 100) {
                imdbIds = imdbIds.slice(0, 100)
            }

            const movies = await movieService.getMoviesByImdbIds(imdbIds)
            dispatch(addMovies(movies))
        }
    }
}

export const { setMovies, addMovies } = movieSearchReducer.actions
export default movieSearchReducer.reducer
