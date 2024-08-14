import StarIcon from '@mui/icons-material/Star'
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Checkbox,
    Container,
    Divider,
    Link,
    Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { addToMovieList, removeFromMovieList } from '../reducers/movieListReducer'
import { fetchAdditionalMovies } from '../reducers/movieReducer'
import AdvancedSearch, { OrderMovies } from './AdvancedSearch'

const Movie = ({ index, movie }) => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)
    const watched = useSelector((state) => state.movieList.watched)
    const watchlist = useSelector((state) => state.movieList.watchlist)

    const {
        imdbId,
        title,
        year,
        runtime,
        genre,
        director,
        actors,
        plot,
        language,
        country,
        poster,
        metascore,
        rottenTomatoesRating,
        imdbRating,
        imdbVotes,
        boxOffice,
        inMovieLists,
    } = movie

    const justWatchUrl = 'https://www.justwatch.com/us/search?q='

    const handleWatchedOnClick = (event, imdbId) => {
        if (event.target.checked) {
            dispatch(addToMovieList(watched, imdbId, 'watched'))
        } else {
            dispatch(removeFromMovieList(watched, imdbId, 'watched'))
        }
    }

    const handleWatchlistOnClick = (event, imdbId) => {
        if (event.target.checked) {
            dispatch(addToMovieList(watchlist, imdbId, 'watchlist'))
        } else {
            dispatch(removeFromMovieList(watchlist, imdbId, 'watchlist'))
        }
    }
    return (
        <>
            <Card sx={{ display: 'flex', background: theme.palette.background.default }}>
                <CardMedia
                    component="img"
                    sx={{ minWidth: 150, width: 150, height: '100%', py: 1 }}
                    image={poster !== 'N/A' ? poster : '/images/The_Criterion_Collection_Logo.svg'}
                    alt={title}
                    onError={(e) => {
                        e.target.onerror = null
                        e.target.src = '/images/The_Criterion_Collection_Logo.svg'
                    }}
                />

                <CardContent sx={{ width: 1000, py: 1 }}>
                    <Typography variant="h6">
                        <span style={{ fontSize: 16 }}>{index + 1}. </span>
                        <Link href={`https://www.imdb.com/title/${imdbId}`} target="_blank">
                            {title}
                        </Link>
                        <span style={{ fontSize: 14 }}> ({year})</span>
                    </Typography>

                    <Typography variant="caption">
                        {runtime} <span style={{ padding: 5 }}>•</span> {genre}{' '}
                        <span style={{ padding: 5 }}>•</span> {country}{' '}
                        <span style={{ padding: 5 }}>•</span> {language}
                    </Typography>

                    <Typography variant="body2">
                        <span style={{ fontSize: 12 }}>IMDB Votes: </span>
                        {imdbVotes}
                        <span style={{ paddingLeft: 20 }}>
                            <StarIcon sx={{ py: 0, mb: -0.2, width: 15, height: 15 }} /> {imdbRating}
                        </span>
                        <span style={{ fontSize: 12, paddingLeft: 20 }}>Metacritic: </span>
                        {metascore}
                        <span style={{ fontSize: 12, paddingLeft: 20 }}>Rotten Tomatoes: </span>
                        {rottenTomatoesRating}
                        {boxOffice && boxOffice !== 'N/A' && (
                            <>
                                <span style={{ fontSize: 12, paddingLeft: 20 }}>Gross: </span>
                                {boxOffice}
                            </>
                        )}
                    </Typography>

                    <Typography variant="caption">
                        <span style={{ fontStyle: 'italic', color: 'gray' }}>Director:</span> {director}
                        <span style={{ padding: 10 }}>|</span>
                        <span style={{ fontStyle: 'italic', color: 'gray' }}>Stars:</span> {actors}
                    </Typography>

                    <Typography variant="body2" sx={{ py: 1 }}>
                        {plot}
                    </Typography>

                    {inMovieLists && inMovieLists.length > 0 && (
                        <Typography variant="caption">
                            <span style={{ fontStyle: 'italic', color: 'gray' }}>In lists:</span>{' '}
                            {inMovieLists.join(', ')}
                        </Typography>
                    )}

                    <Typography variant="body2">
                        <Link href={`${justWatchUrl}${title}`} target="_blank">
                            Where to watch
                        </Link>
                    </Typography>
                </CardContent>
                {user && watched.imdbIds && watchlist.imdbIds && (
                    <Box sx={{ alignSelf: 'center' }}>
                        <Typography variant="caption">Watched</Typography>
                        <Checkbox
                            checked={watched.imdbIds.includes(imdbId)}
                            onChange={(event) => handleWatchedOnClick(event, imdbId)}
                        />
                        <br />
                        <Typography variant="caption">Watchlist</Typography>
                        <Checkbox
                            checked={watchlist.imdbIds.includes(imdbId)}
                            onChange={(event) => {
                                handleWatchlistOnClick(event, imdbId)
                            }}
                        />
                    </Box>
                )}
            </Card>
            <Divider />
        </>
    )
}

const Movies = () => {
    const theme = useTheme()
    const movies = useSelector((state) => state.movies)
    const listName = useSelector((state) => state.movieList.currentMovieList.name)
    const dispatch = useDispatch()

    useEffect(() => {
        let hasFetched = false
        const onScroll = () => {
            if (
                !hasFetched &&
                window.innerHeight + document.documentElement.scrollTop ===
                    document.documentElement.offsetHeight
            ) {
                hasFetched = true
                dispatch(fetchAdditionalMovies())
            } else if (hasFetched) {
                hasFetched = false
            }
        }

        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const rowStyle = {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    }

    return (
        <Container sx={{ marginTop: 12, color: theme.palette.text.primary }}>
            {listName === 'Search results' && <AdvancedSearch />}
            {listName ? (
                <Box sx={rowStyle}>
                    <Typography variant="h5">
                        {listName}{' '}
                        {listName === 'Search results' && movies.length > 0 && `(${movies.length} movies)`}
                    </Typography>
                    {listName === 'Search results' && <OrderMovies />}
                </Box>
            ) : (
                <p>Choose some movie list from the menu bar.</p>
            )}

            {movies.length === 0 && listName ? (
                <Typography>No movies in this list</Typography>
            ) : (
                movies.map((movie, index) => <Movie key={movie.imdbId} movie={movie} index={index} />)
            )}
        </Container>
    )
}

export default Movies
