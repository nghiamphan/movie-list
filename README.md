# Project Motivation

I often browse curated movie lists such as [The Criterion Collection](https://www.criterion.com/shop/browse/list?sort=spine_number), [They Shoot Pictures, Don't They (TSPDT)](https://www.theyshootpictures.com/gf1000_all1000films_table.php), and the [AFI Top 100 Movies](https://www.afi.com/afis-100-years-100-movies/). Other than going to each specific website, popular platforms like IMDB and Letterboxd offer user-created and shared lists. However, they often fall short in the following aspects:

-   Limited information: Movie details like genre, synopsis, director, and actors are often missing, requiring users to visit individual movie pages.
-   No continuous scrolling: For extensive lists, navigating through hundreds of entries can be tedious and require manual pagination.

This project aims to address these limitations while providing a single hub for my favorite movie lists.

# Features

-   Diverse movie lists: The platform incorporates popular curated lists like The Criterion Collection, TSPDT, AFI Top 100 Movies, and much more.
-   Rich movie information: Within the list, each movie entry provides details like year, length, genre, production country, ratings, director, actors, and a synopsis. Data is initially retrieved from the [OMDB API](https://www.omdbapi.com/) and stored in a PostgresSQL database.
-   Continuous scrolling: Lists exceeding 100 movies offer continuous scrolling functionality, fetching additional entries in batches of 100.
-   Search functionality: Users can search for movies by title, director, or actor through a dedicated search bar.
-   User accounts: Registered users can create personalized watchlists and track their movie viewing history.

# Tools

Frontend: Javascript, React, React-Redux, Axios, React-Router, Material UI.

Backend: NodeJS, Express, PostgresSQL, Sequelize, JSON Web Token, Bcrypt, Dotenv, GitHub
Actions.

# Deployment

The application and its PostgresSQL database are hosted on [Fly.io](https://movie-list.fly.dev/). A CI/CD pipeline is established using GitHub Actions, automatically deploying code updates upon commits to the project's GitHub repository.
