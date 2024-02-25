import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Drawer, List, ListItemButton, ListItemText } from '@mui/material'

import { fetchMovies } from '../reducers/movieReducer'
import { setCurrentMovieList } from '../reducers/movieListReducer'

const MovieLists = () => {
    const dispatch = useDispatch()

    const movieLists = useSelector((state) => state.movieList.defaultMovieLists)

    const handleOnClick = (movieList) => {
        window.scrollTo(0, 0)
        dispatch(setCurrentMovieList(movieList))
        dispatch(fetchMovies(movieList.imdbIds))
    }

    return (
        <nav aria-label="main mailbox folders">
            <List>
                {movieLists.map((movieList) => (
                    <ListItemButton
                        sx={{ height: 30, padding: 1 }}
                        key={movieList.id}
                        onClick={() => handleOnClick(movieList)}
                    >
                        <ListItemText sx={{ fontSize: 18 }} secondary={movieList.name} />
                    </ListItemButton>
                ))}
            </List>
        </nav>
    )
}

const MovieListDrawer = () => {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [drawerPermanent, setDrawerPermanent] = useState(false)

    return (
        <>
            <Button sx={{ color: 'white' }} onClick={() => setDrawerOpen(!drawerOpen)}>
                Default Movie List
            </Button>

            <Drawer
                sx={{
                    '& .MuiPaper-root': {
                        position: 'absolute',
                        marginTop: '65px',
                        height: 'calc(100vh - 65px)',
                    },
                }}
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                variant={drawerPermanent ? 'permanent' : 'temporary'}
            >
                <Button
                    sx={{ width: 30, height: 20, alignSelf: 'flex-end', marginTop: 1, marginRight: 1 }}
                    variant={drawerPermanent ? 'outlined' : 'contained'}
                    onClick={() => setDrawerPermanent(!drawerPermanent)}
                >
                    {drawerPermanent ? 'Unpin' : 'Pin'}
                </Button>
                <MovieLists />
            </Drawer>
        </>
    )
}

export { MovieListDrawer }
export default MovieLists
