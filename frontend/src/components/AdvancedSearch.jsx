import { Box, Button, Checkbox, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { advancedSearchMovies } from '../reducers/movieReducer'

const AdvancedSearch = () => {
    const dispatch = useDispatch()
    const movieLists = useSelector((state) => state.movieList.defaultMovieLists)
    const movieListNames = movieLists.map((movieList) => movieList.name)

    const [hideAdvancedSearch, setHideAdvancedSearch] = useState(true)
    const [search, setSearch] = useState({
        title: '',
        yearMin: '',
        yearMax: '',
        director: '',
        actors: '',
        country: '',
        genre: '',
        notGenre: '',
        imdbVotesMin: '',
        imdbVotesMax: '',
        imdbRatingMin: '',
        imdbRatingMax: '',
        inMovieLists: [],
    })

    const handleSearch = async () => {
        console.log(search)
        dispatch(advancedSearchMovies(search))
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setSearch((prevSearch) => ({
            ...prevSearch,
            [name]: value,
        }))
    }

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target
        setSearch((prevState) => {
            const selectedMovieLists = checked
                ? [...prevState.inMovieLists, name]
                : prevState.inMovieLists.filter((list) => list !== name)
            return {
                ...prevState,
                inMovieLists: selectedMovieLists,
            }
        })
    }

    const rowStyle = {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 0.5,
        marginBottom: 0.5,
    }

    const listRowStyle = {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    }

    const inputLabelStyle = {
        width: '10%',
        minWidth: 100,
        fontWeight: 'bold',
    }

    const middleLabelStyle = {
        marginLeft: 1,
        marginRight: 1,
    }

    const inputStyle = {
        height: 25,
        fontSize: 14,
    }

    const buttonStyle = {
        marginTop: 1,
        marginBottom: 1,
    }

    return (
        <Box>
            <Box sx={{ ...rowStyle, justifyContent: 'space-between' }}>
                <Typography variant="h5">Advanced Search</Typography>
                <Button onClick={() => setHideAdvancedSearch(!hideAdvancedSearch)}>
                    {hideAdvancedSearch ? 'Show Advanced Search' : 'Hide Advanced Search'}
                </Button>
            </Box>

            {!hideAdvancedSearch && (
                <>
                    <Box sx={rowStyle}>
                        <Typography sx={inputLabelStyle} variant="subtitle1">
                            Title
                        </Typography>
                        <TextField
                            InputProps={{ sx: inputStyle }}
                            type="text"
                            name="title"
                            value={search.title}
                            onChange={handleChange}
                            placeholder="Braveheart"
                        />
                    </Box>

                    <Box sx={rowStyle}>
                        <Typography sx={inputLabelStyle} variant="subtitle1">
                            Year
                        </Typography>
                        <TextField
                            InputProps={{ sx: inputStyle }}
                            type="number"
                            name="yearMin"
                            value={search.yearMin}
                            onChange={handleChange}
                            placeholder="1995"
                        />
                        <Typography sx={middleLabelStyle} variant="subtitle1">
                            to
                        </Typography>
                        <TextField
                            InputProps={{ sx: inputStyle }}
                            type="number"
                            name="yearMax"
                            value={search.yearMax}
                            onChange={handleChange}
                            placeholder="1995"
                        />
                    </Box>

                    <Box sx={rowStyle}>
                        <Typography sx={inputLabelStyle} variant="subtitle1">
                            Director
                        </Typography>
                        <TextField
                            InputProps={{ sx: inputStyle }}
                            type="text"
                            name="director"
                            value={search.director}
                            onChange={handleChange}
                            placeholder="Mel Gibson"
                        />
                    </Box>

                    <Box sx={rowStyle}>
                        <Typography sx={inputLabelStyle} variant="subtitle1">
                            Actor
                        </Typography>
                        <TextField
                            InputProps={{ sx: inputStyle }}
                            type="text"
                            name="actors"
                            value={search.actors}
                            onChange={handleChange}
                            placeholder="Mel Gibson"
                        />
                    </Box>

                    <Box sx={rowStyle}>
                        <Typography sx={inputLabelStyle} variant="subtitle1">
                            Country
                        </Typography>
                        <TextField
                            InputProps={{ sx: inputStyle }}
                            type="text"
                            name="country"
                            value={search.country}
                            onChange={handleChange}
                            placeholder="United States"
                        />
                    </Box>

                    <Box sx={rowStyle}>
                        <Typography sx={inputLabelStyle} variant="subtitle1">
                            Genre
                        </Typography>
                        <TextField
                            InputProps={{ sx: inputStyle }}
                            type="text"
                            name="genre"
                            value={search.genre}
                            onChange={handleChange}
                            placeholder="Drama"
                        />
                    </Box>

                    <Box sx={rowStyle}>
                        <Typography sx={inputLabelStyle} variant="subtitle1">
                            Exclude Genre
                        </Typography>
                        <TextField
                            InputProps={{ sx: inputStyle }}
                            type="text"
                            name="notGenre"
                            value={search.notGenre}
                            onChange={handleChange}
                            placeholder="Documentary"
                        />
                    </Box>

                    <Box sx={rowStyle}>
                        <Typography sx={inputLabelStyle} variant="subtitle1">
                            IMDB Votes
                        </Typography>
                        <TextField
                            InputProps={{ sx: inputStyle }}
                            type="number"
                            name="imdbVotesMin"
                            value={search.imdbVotesMin}
                            onChange={handleChange}
                            placeholder="10000"
                        />
                        <Typography sx={middleLabelStyle} variant="subtitle1">
                            to
                        </Typography>
                        <TextField
                            InputProps={{ sx: inputStyle }}
                            type="number"
                            name="imdbVotesMax"
                            value={search.imdbVotesMax}
                            onChange={handleChange}
                            placeholder="1000000"
                        />
                    </Box>

                    <Box sx={rowStyle}>
                        <Typography sx={inputLabelStyle} variant="subtitle1">
                            IMDB Rating
                        </Typography>
                        <TextField
                            InputProps={{ sx: inputStyle }}
                            type="number"
                            name="imdbRatingMin"
                            value={search.imdbRatingMin}
                            onChange={handleChange}
                            placeholder="7"
                        />
                        <Typography sx={middleLabelStyle} variant="subtitle1">
                            to
                        </Typography>
                        <TextField
                            InputProps={{ sx: inputStyle }}
                            type="number"
                            name="imdbRatingMax"
                            value={search.imdbRatingMax}
                            onChange={handleChange}
                            placeholder="9"
                        />
                    </Box>

                    <Typography sx={inputLabelStyle} variant="subtitle1">
                        In Movie Lists
                    </Typography>

                    {movieListNames.map((name) => (
                        <Box key={name} sx={listRowStyle}>
                            <Checkbox
                                sx={{ height: 25, width: 25 }}
                                type="checkbox"
                                name={name}
                                checked={search.inMovieLists.includes(name)}
                                onChange={handleCheckboxChange}
                            />
                            <Typography sx={{ fontSize: 13 }}>{name}</Typography>
                        </Box>
                    ))}

                    <Button sx={buttonStyle} variant="contained" onClick={handleSearch}>
                        Search
                    </Button>
                </>
            )}
        </Box>
    )
}

export default AdvancedSearch
