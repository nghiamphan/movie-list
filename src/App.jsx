/* prettier-disable multiline-ternary */
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material'

import SearchMovies from './components/SearchMovies'
import { LoginForm, RegisterForm } from './components/LoginForm'
import { MovieListDrawer } from './components/MovieList'
import Movies from './components/Movie'
import movieListService from './services/movieLists'
import {
    fetchDefaultMovieLists,
    fetchWatched,
    fetchWatchlist,
    setCurrentMovieListName,
} from './reducers/movieListReducer'
import { setUser, logout } from './reducers/userReducer'
import { fetchMovies } from './reducers/movieReducer'
import { LOGGGED_MOVIE_USER } from './utils/config'

const App = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector((state) => state.user)
    const watchlist = useSelector((state) => state.movieList.watchlist)
    const watched = useSelector((state) => state.movieList.watched)

    useEffect(() => {
        dispatch(fetchDefaultMovieLists())
        const loggedUserJSON = window.localStorage.getItem(LOGGGED_MOVIE_USER)
        if (loggedUserJSON) {
            const loggedUser = JSON.parse(loggedUserJSON)
            movieListService.setToken(loggedUser.token)
            dispatch(setUser(loggedUser))
            dispatch(fetchWatchlist())
            dispatch(fetchWatched())
            navigate('/')
        }
    }, [dispatch])

    const handleWatchlistClick = () => {
        if (user) {
            window.scrollTo(0, 0)
            dispatch(fetchMovies(watchlist.imdbIds))
            dispatch(setCurrentMovieListName('My watchlist'))
        }
    }

    const handleWatchHistoryClick = () => {
        if (user) {
            window.scrollTo(0, 0)
            dispatch(fetchMovies(watched.imdbIds))
            dispatch(setCurrentMovieListName('Watch history'))
        }
    }

    return (
        <>
            <AppBar>
                <Toolbar>
                    <Box sx={{ display: 'inline-flex', flexGrow: 1 }}>
                        <Link to="/">
                            <MovieListDrawer />
                        </Link>

                        <Link to="/watchlist">
                            <Typography sx={{ alignSelf: 'center', marginLeft: 1, marginRight: 1 }}>
                                <Button sx={{ color: 'white' }} onClick={handleWatchlistClick}>
                                    My watchlist
                                </Button>
                            </Typography>
                        </Link>

                        <Link to="/watchhistory">
                            <Typography sx={{ alignSelf: 'center', marginRight: 1 }}>
                                <Button sx={{ color: 'white' }} onClick={handleWatchHistoryClick}>
                                    Watch history
                                </Button>
                            </Typography>
                        </Link>

                        <SearchMovies />
                    </Box>

                    <Box sx={{ display: 'flex', alignSelf: 'flex-right' }}>
                        {!user ? (
                            <>
                                <Link to="/login">
                                    <Button sx={{ color: 'white' }}>Login</Button>
                                </Link>
                                <Link to="/register">
                                    <Button sx={{ color: 'white' }}>Register</Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Typography sx={{ alignSelf: 'center', marginRight: 2 }}>
                                    Hello {user.username}
                                </Typography>
                                <Link to="/">
                                    <Button sx={{ color: 'white' }} onClick={() => dispatch(logout())}>
                                        Logout
                                    </Button>
                                </Link>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            <Routes>
                <Route path="/" element={<Movies />} />
                <Route
                    path="/watchlist"
                    element={
                        user ? (
                            <Movies />
                        ) : (
                            <Container sx={{ marginTop: 12 }}>Login to see your watchlist.</Container>
                        )
                    }
                />
                <Route
                    path="/watchhistory"
                    element={
                        user ? (
                            <Movies />
                        ) : (
                            <Container sx={{ marginTop: 12 }}>Login to see your watch history.</Container>
                        )
                    }
                />
                <Route path="/login" element={!user ? <LoginForm /> : <Navigate to="/" />} />
                <Route path="/register" element={!user ? <RegisterForm /> : <Navigate to="/" />} />
            </Routes>
        </>
    )
}

export default App
