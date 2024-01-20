const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class Movie extends Model {}

Movie.init(
    {
        imdbId: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        title: DataTypes.STRING,
        year: DataTypes.STRING(16),
        rated: DataTypes.STRING(16),
        released: DataTypes.STRING(16),
        runtime: DataTypes.STRING(16),
        genre: DataTypes.STRING(64),
        director: DataTypes.STRING,
        writer: DataTypes.STRING,
        actors: DataTypes.STRING,
        plot: DataTypes.TEXT,
        language: DataTypes.STRING,
        country: DataTypes.STRING,
        awards: DataTypes.STRING,
        poster: DataTypes.STRING,
        metascore: DataTypes.STRING(8),
        rottenTomatoesRating: DataTypes.STRING(8),
        imdbRating: DataTypes.STRING(8),
        imdbVotes: DataTypes.STRING(16),
        type: DataTypes.STRING(16),
        dvd: DataTypes.STRING(16),
        boxOffice: DataTypes.STRING(16),
        production: DataTypes.STRING,
        website: DataTypes.STRING(32),
        inMovieLists: {
            type: DataTypes.ARRAY(DataTypes.TEXT),
        },
    },
    {
        sequelize,
        underscored: true,
        timestamps: true,
        modelName: 'movie',
    }
)

module.exports = Movie
