/* eslint-disable react/no-unescaped-entities */
import { CardMedia, Container, Link, ThemeProvider, Typography, createTheme } from '@mui/material'

const AboutPage = () => {
    const image = '/images/Letterboxd Logo.png'
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
                    I usually browse lists of movies such as{' '}
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
                    . Other than going to each specific website, IMDB and Letterboxd are two popular places
                    to browse for such movie lists which are created and shared by users. However, all of
                    these websites have at least one of the following limitations:
                    <ul>
                        <li>
                            The list does not display enough information such as genre, synopsis, director
                            and actors about each movie so that user can take a quick look without having to
                            go to each movie's own web page.
                        </li>
                        <li>The list does not have continuous scrolling.</li>
                    </ul>
                    So I created this website to have all the movie lists I care about in one place, and to
                    have the above limitations addressed.
                </Typography>

                <Typography variant="h5">Features</Typography>
                <Typography variant="body1" component="div">
                    <ul>
                        <li>
                            There are popular movie lists such as The Criterion Collection, TSPDT, AFI Top
                            100 Movies, and much more.
                        </li>
                        <li>
                            Each movie list displays information such as year, length, genre, production
                            country, ratings, director, actors and synopsis. The movie data is first fetched
                            from{' '}
                            <Link href="https://www.omdbapi.com/" target="_blank">
                                OMDB API
                            </Link>{' '}
                            and then stored in the PostgresSQL database.
                        </li>
                        <li>
                            For movie lists that have more than 100 movies, the website has continuous
                            scrolling that fetches 100 movies at a time.
                        </li>
                        <li>There is a search bar to search for movies by title, director, or actor.</li>
                        <li>
                            User can create their own account. A logged-in user can add a movie to their own
                            watchlist and watch history.
                        </li>
                    </ul>
                </Typography>

                <Typography variant="h5">Tools</Typography>
                <Typography variant="body1">
                    Frontend: Javascript, React, React-Redux, Axios, React-Router, Material UI.
                    <br />
                    Backend: NodeJS, Express, PostgresSQL, Sequelize, JSON Web Token, Bcrypt, Dotenv, GitHub
                    Actions.
                </Typography>

                <Typography variant="h5">Deployment</Typography>
                <Typography sx={{ marginBottom: 30 }} variant="body1">
                    The website and Postgres database are hosted on{' '}
                    <Link href={deployment} target="_blank">
                        Fly.io
                    </Link>
                    . A GitHub Actions pipeline is set up for CI/CD that autodeploys new changes when the
                    code is pushed to the GitHub repository.
                </Typography>
            </ThemeProvider>
        </Container>
    )
}

export default AboutPage
