import React from 'react'
import { useDispatch } from 'react-redux'
import { Button, Container, TextField, Tooltip } from '@mui/material'

import movieService from '../services/movies'
import { setMovies } from '../reducers/movieReducer'

const SearchMovies = () => {
    const dispatch = useDispatch()
    const [isFetching, setIsFetching] = React.useState(false)

    const findMovie = (event) => {
        event.preventDefault()
        setIsFetching(true)
        movieService.getMovies(event.target[0].value).then((response) => {
            dispatch(setMovies(response))
            setIsFetching(false)
        })
    }

    return (
        <Container>
            <form onSubmit={findMovie}>
                <Tooltip title="Each line should contain a movie title and optionally the year separated by tab character.">
                    <TextField
                        sx={{ width: '75ch' }}
                        multiline
                        placeholder="braveheart 1995&#10;brave"
                    />
                </Tooltip>
                <br />
                <Button type="submit" variant="contained" disabled={isFetching}>
                    {!isFetching ? 'Search' : 'Searching...'}
                </Button>
            </form>
        </Container>
    )
}

export default SearchMovies
