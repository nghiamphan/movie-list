import { createSlice } from '@reduxjs/toolkit'
import movieListService from '../services/movieLists'

/*
 * state:
 * {
 *    defaultMovieLists: [movieListObject, movieListObject, ...],
 *    watchlist: {movieListObject},
 *    watched: {movieListObject},
 *    currentMovieList: {movieListObject},
 * }
 * movieListObject:
 * {
 *    id,
 *    name,
 *    imdbIds: [imdbId, imdbId, ...],
 *    userId,
 *    type,
 * }
 */
const movieListReducer = createSlice({
    name: 'movieList',
    initialState: {
        defaultMovieLists: [],
        watchlist: {},
        watched: {},
        currentMovieList: {},
    },
    reducers: {
        setDefaultMovieLists: (state, action) => {
            state.defaultMovieLists = action.payload
            return state
        },
        setWatchlist: (state, action) => {
            state.watchlist = action.payload
            return state
        },
        setWatched: (state, action) => {
            state.watched = action.payload
            return state
        },
        setCurrentMovieList: (state, action) => {
            state.currentMovieList = action.payload
            return state
        },
    },
})

export const fetchDefaultMovieLists = () => {
    return async (dispatch) => {
        const movieLists = await movieListService.getDefaultMovieLists()
        dispatch(setDefaultMovieLists(movieLists))
    }
}

export const fetchWatchlist = () => {
    return async (dispatch) => {
        const watchlist = await movieListService.getWatchlist()
        dispatch(setWatchlist(watchlist))
    }
}

export const fetchWatched = () => {
    return async (dispatch) => {
        const watched = await movieListService.getWatched()
        dispatch(setWatched(watched))
    }
}

export const addToMovieList = (movieList, imdbId, type) => {
    return async (dispatch) => {
        movieList = {
            ...movieList,
            imdbIds: movieList.imdbIds || [],
        }

        if (!movieList.imdbIds.includes(imdbId)) {
            movieList.imdbIds = movieList.imdbIds.concat(imdbId)
            if (type === 'watchlist') {
                dispatch(setWatchlist(movieList))
            } else if (type === 'watched') {
                dispatch(setWatched(movieList))
            }
            await movieListService.update(movieList)
        }
    }
}

export const removeFromMovieList = (movieList, imdbId, type) => {
    return async (dispatch) => {
        movieList = {
            ...movieList,
            imdbIds: movieList.imdbIds || [],
        }

        if (movieList.imdbIds.includes(imdbId)) {
            movieList.imdbIds = movieList.imdbIds.filter((id) => id !== imdbId)
            if (type === 'watchlist') {
                dispatch(setWatchlist(movieList))
            } else if (type === 'watched') {
                dispatch(setWatched(movieList))
            }
            await movieListService.update(movieList)
        }
    }
}

export const { setDefaultMovieLists, setWatchlist, setWatched, setCurrentMovieList } =
    movieListReducer.actions
export default movieListReducer.reducer
