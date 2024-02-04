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
    },
})

export const searchMovies = (query) => {
    return async (dispatch) => {
        const movies = await movieService.searchMovies(query)
        dispatch(setMovies(movies))
    }
}

export const fetchMovies = (imdbIds) => {
    return async (dispatch) => {
        const movies = await movieService.getMoviesByImdbIds(imdbIds)
        dispatch(setMovies(movies))
    }
}

export const { setMovies } = movieSearchReducer.actions
export default movieSearchReducer.reducer
