/* prettier-disable multiline-ternary */
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import {
    AppBar,
    Box,
    Button,
    Container,
    CssBaseline,
    Switch,
    ThemeProvider,
    Toolbar,
    Typography,
    createTheme,
} from '@mui/material'

import SearchMovies from './components/SearchMovies'
import { LoginForm, RegisterForm } from './components/LoginForm'
import { MovieListDrawer } from './components/MovieList'
import Movies from './components/Movie'
import movieListService from './services/movieLists'
import {
    fetchDefaultMovieLists,
    fetchWatched,
    fetchWatchlist,
    setCurrentMovieList,
} from './reducers/movieListReducer'
import { setUser, logout } from './reducers/userReducer'
import { fetchMovies } from './reducers/movieReducer'
import { LOGGGED_MOVIE_USER } from './utils/config'
import AboutPage from './components/AboutPage'

const App = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector((state) => state.user)
    const watchlist = useSelector((state) => state.movieList.watchlist)
    const watched = useSelector((state) => state.movieList.watched)

    const [darkMode, setDarkMode] = useState(
        window.localStorage.getItem('darkMode') !== null
            ? window.localStorage.getItem('darkMode') === 'true'
            : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    )

    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
        },
    })

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
            dispatch(setCurrentMovieList({ ...watchlist, name: 'Your Watchlist' }))
            dispatch(fetchMovies(watchlist.imdbIds))
        }
    }

    const handleWatchHistoryClick = () => {
        if (user) {
            window.scrollTo(0, 0)
            dispatch(setCurrentMovieList({ ...watched, name: 'Your Watch History' }))
            dispatch(fetchMovies(watched.imdbIds))
        }
    }

    const handleDarkModeChange = (event) => {
        setDarkMode(event.target.checked)
        window.localStorage.setItem('darkMode', event.target.checked)
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar>
                <Toolbar>
                    <Box sx={{ display: 'inline-flex', flexGrow: 1 }}>
                        <Link to="/about">
                            <Typography sx={{ alignSelf: 'center', marginLeft: 1, marginRight: 1 }}>
                                <Button sx={{ color: 'white' }}>About</Button>
                            </Typography>
                        </Link>

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
                        <Switch checked={darkMode} onChange={handleDarkModeChange} />
                        <Typography sx={{ alignSelf: 'center' }} variant="body2">
                            Dark Mode
                        </Typography>
                    </Box>
                </Toolbar>
            </AppBar>

            <Routes>
                <Route path="/" element={<Movies />} />
                <Route path="/about" element={<AboutPage />} />
                <Route
                    path="/watchlist"
                    element={
                        user ? (
                            <Movies />
                        ) : (
                            <Container sx={{ marginTop: 12, color: theme.palette.text.primary }}>
                                Login to see your watchlist.
                            </Container>
                        )
                    }
                />
                <Route
                    path="/watchhistory"
                    element={
                        user ? (
                            <Movies />
                        ) : (
                            <Container sx={{ marginTop: 12, color: theme.palette.text.primary }}>
                                Login to see your watch history.
                            </Container>
                        )
                    }
                />
                <Route path="/login" element={!user ? <LoginForm /> : <Navigate to="/" />} />
                <Route path="/register" element={!user ? <RegisterForm /> : <Navigate to="/" />} />
            </Routes>
        </ThemeProvider>
    )
}

export default App
