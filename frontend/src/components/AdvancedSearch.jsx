import {
    Box,
    Button,
    Checkbox,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { advancedSearchMovies, orderMovies } from '../reducers/movieReducer'

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
    }

    const columnStyle = {
        display: 'flex',
        flexDirection: 'column',
        marginRight: 20,
        '& .MuiTextField-root': { marginTop: 1 },
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
                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                        <Box sx={columnStyle}>
                            <TextField
                                size="small"
                                label="Title"
                                type="text"
                                name="title"
                                value={search.title}
                                onChange={handleChange}
                                placeholder="Braveheart"
                            />

                            <TextField
                                size="small"
                                label="From Year"
                                type="number"
                                name="yearMin"
                                value={search.yearMin}
                                onChange={handleChange}
                                placeholder="1995"
                            />

                            <TextField
                                size="small"
                                label="To Year"
                                type="number"
                                name="yearMax"
                                value={search.yearMax}
                                onChange={handleChange}
                                placeholder="1995"
                            />

                            <TextField
                                size="small"
                                label="Director"
                                type="text"
                                name="director"
                                value={search.director}
                                onChange={handleChange}
                                placeholder="Mel Gibson"
                            />

                            <TextField
                                size="small"
                                label="Actor"
                                type="text"
                                name="actors"
                                value={search.actors}
                                onChange={handleChange}
                                placeholder="Mel Gibson"
                            />

                            <TextField
                                size="small"
                                label="Country"
                                type="text"
                                name="country"
                                value={search.country}
                                onChange={handleChange}
                                placeholder="United States"
                            />

                            <TextField
                                size="small"
                                label="Genre"
                                type="text"
                                name="genre"
                                value={search.genre}
                                onChange={handleChange}
                                placeholder="Drama"
                            />

                            <TextField
                                size="small"
                                label="Exclude Genre"
                                type="text"
                                name="notGenre"
                                value={search.notGenre}
                                onChange={handleChange}
                                placeholder="Documentary"
                            />

                            <TextField
                                size="small"
                                label="Min IMDB Votes"
                                type="number"
                                name="imdbVotesMin"
                                value={search.imdbVotesMin}
                                onChange={handleChange}
                                placeholder="10000"
                            />

                            <TextField
                                size="small"
                                label="Max IMDB Votes"
                                type="number"
                                name="imdbVotesMax"
                                value={search.imdbVotesMax}
                                onChange={handleChange}
                                placeholder="1000000"
                            />

                            <TextField
                                size="small"
                                label="Min IMDB Rating"
                                type="number"
                                name="imdbRatingMin"
                                value={search.imdbRatingMin}
                                onChange={handleChange}
                                placeholder="7"
                            />

                            <TextField
                                size="small"
                                label="Max IMDB Rating"
                                type="number"
                                name="imdbRatingMax"
                                value={search.imdbRatingMax}
                                onChange={handleChange}
                                placeholder="9"
                            />
                        </Box>

                        <Box sx={columnStyle}>
                            <Typography sx={{ fontWeight: 'bold' }} variant="subtitle1">
                                In Movie Lists
                            </Typography>

                            {movieListNames.map((name) => (
                                <Box key={name} sx={rowStyle}>
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
                        </Box>
                    </Box>

                    <Button sx={buttonStyle} variant="contained" onClick={handleSearch}>
                        Search
                    </Button>
                </>
            )}
        </Box>
    )
}

const OrderMovies = () => {
    const dispatch = useDispatch()
    const [orderBy, setOrderBy] = useState('')

    const handleChange = (event) => {
        const value = event.target.value
        setOrderBy(value)
        dispatch(orderMovies(value))
    }

    return (
        <FormControl sx={{ width: 200 }}>
            <InputLabel id="order-by-label">Order By</InputLabel>
            <Select labelId="order-by-label" label="Order By" value={orderBy} onChange={handleChange}>
                <MenuItem value="imdbVotes">IMDB Votes</MenuItem>
                <MenuItem value="imdbRating">IMDB Rating</MenuItem>
            </Select>
        </FormControl>
    )
}

export default AdvancedSearch
export { OrderMovies }
