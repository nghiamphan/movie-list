/* eslint-disable react/no-unescaped-entities */
import { CardMedia, Container, Link, ThemeProvider, Tooltip, Typography, createTheme } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'

const AboutPage = () => {
    const image = '/images/Letterboxd Logo.png'
    const github = 'https://github.com/nghiamphan/movie-list'
    const deployment = 'https://movie-list.fly.dev/'

    const typographyTheme = createTheme({
        typography: {
            allVariants: {
                marginBottom: 15,
            },
            h5: {
                marginTop: 30,
            },
        },
    })

    return (
        <Container sx={{ marginTop: 12 }}>
            <CardMedia sx={{ height: 250 }} component="img" image={image} />

            <ThemeProvider theme={typographyTheme}>
                <Typography variant="h5">Project Motivation</Typography>
                <Typography variant="body1" component="div">
                    I often browse curated movie lists such as{' '}
                    <Link
                        href="https://www.criterion.com/shop/browse/list?sort=spine_number"
                        target="_blank"
                    >
                        The Criterion Collection
                    </Link>
                    ,{' '}
                    <Link
                        href="https://www.theyshootpictures.com/gf1000_all1000films_table.php"
                        target="_blank"
                    >
                        They Shoot Picture, Don't They (TSPDT)
                    </Link>{' '}
                    or{' '}
                    <Link href="https://www.afi.com/afis-100-years-100-movies/" target="_blank">
                        AFI Top 100 Movies
                    </Link>
                    . Other than going to each specific website, popular platforms like IMDB and Letterboxd
                    offer user-created and shared lists. However, they often fall short in the following
                    aspects:
                    <ul>
                        <li>
                            Limited information: Movie details like genre, synopsis, director, and actors
                            are often missing, requiring users to visit individual movie pages.
                        </li>
                        <li>
                            No continuous scrolling: For extensive lists, navigating through hundreds of
                            entries can be tedious and require manual pagination.
                        </li>
                    </ul>
                    This project aims to address these limitations while providing a single hub for my
                    favorite movie lists.
                </Typography>

                <Typography variant="h5">Features</Typography>
                <Typography variant="body1" component="div">
                    <ul>
                        <li>
                            Diverse movie lists: The platform incorporates popular curated lists like The
                            Criterion Collection, TSPDT, AFI Top 100 Movies, and much more.
                        </li>
                        <li>
                            Rich movie information: Within the list, each movie entry provides details like
                            year, length, genre, production country, ratings, director, actors, and a
                            synopsis. Data is initially retrieved from the{' '}
                            <Link href="https://www.omdbapi.com/" target="_blank">
                                OMDB API
                            </Link>{' '}
                            and stored in a PostgresSQL database.
                        </li>
                        <li>
                            Continuous scrolling: Lists exceeding 100 movies offer continuous scrolling
                            functionality, fetching additional entries in batches of 100.
                        </li>
                        <li>
                            Search functionality: Users can search for movies by title, director, or actor
                            through a dedicated search bar.
                        </li>
                        <li>
                            User accounts: Registered users can create personalized watchlists and track
                            their movie viewing history.
                        </li>
                    </ul>
                </Typography>

                <Typography variant="h5">Tools</Typography>
                <Typography variant="body1" component="div">
                    Frontend: Javascript, React, React-Redux, Axios, React-Router, Material UI.
                    <br />
                    Backend: NodeJS, Express, PostgresSQL, Sequelize, JSON Web Token, Bcrypt, Dotenv, GitHub
                    Actions.
                    <br />
                    <Typography sx={{ marginTop: 2 }} variant="subtitle1">
                        GitHub repository:{' '}
                        <Link href={github} target="_blank">
                            <Tooltip title="GitHub">
                                <GitHubIcon sx={{ verticalAlign: 'top' }} />
                            </Tooltip>
                        </Link>
                    </Typography>
                </Typography>

                <Typography variant="h5">Deployment</Typography>
                <Typography sx={{ marginBottom: 30 }} variant="body1">
                    The application and its PostgresSQL database are hosted on{' '}
                    <Link href={deployment} target="_blank">
                        Fly.io
                    </Link>
                    . A CI/CD pipeline is established using GitHub Actions, automatically deploying code
                    updates upon commits to the project's GitHub repository.
                </Typography>
            </ThemeProvider>
        </Container>
    )
}

export default AboutPage
