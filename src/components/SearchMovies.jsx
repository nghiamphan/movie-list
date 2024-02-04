import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Box, InputBase } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

import { searchMovies } from '../reducers/movieReducer'
import { setCurrentMovieListName } from '../reducers/movieListReducer'

const SearchMovies = () => {
    const dispatch = useDispatch()
    const [query, setQuery] = useState('')

    const handleSearch = (event) => {
        if (event.key === 'Enter' || event.type === 'click') {
            if (query.length > 0) {
                window.scrollTo(0, 0)
                dispatch(searchMovies(query))
                dispatch(setCurrentMovieListName('Search results'))
            }
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                background: 'gray',
                marginLeft: 1,
                marginRight: 1,
            }}
        >
            <InputBase
                sx={{ marginLeft: 1 }}
                placeholder="Search movies.."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleSearch}
            />
            <SearchIcon sx={{ marginRight: 1 }} onClick={handleSearch} />
        </Box>
    )
}

export default SearchMovies
