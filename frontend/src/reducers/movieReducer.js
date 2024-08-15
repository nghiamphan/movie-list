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

/**
 * @param {string} query - The search query.
 */
export const searchMovies = (query) => {
    return async (dispatch) => {
        const movies = await movieService.searchMovies(query)
        dispatch(setMovies(movies))
    }
}

/**
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
export const advancedSearchMovies = (body) => {
    return async (dispatch) => {
        const movies = await movieService.advancedSearchMovies(body)
        dispatch(setMovies(movies))
    }
}

/**
 * @param {string} orderBy - The field to order the movies by. Eg. 'imdbRating', 'imdbVotes'.
 */
export const orderMovies = (orderBy) => {
    return (dispatch, getState) => {
        const movies = getState().movies

        // Sort movies by the orderBy field in descending order
        const sortedMovies = [...movies].sort((a, b) => {
            const x = parseFloat(a[orderBy].replace(/,/g, ''))
            const y = parseFloat(b[orderBy].replace(/,/g, ''))
            return y - x
        })
        dispatch(setMovies(sortedMovies))
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
