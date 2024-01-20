const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class MovieList extends Model {}

MovieList.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        imdbIds: {
            type: DataTypes.ARRAY(DataTypes.TEXT),
            defaultValue: [],
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        type: {
            type: DataTypes.STRING(16),
            allowNull: false,
            defaultValue: 'public',
            validate: {
                isIn: [['default', 'public', 'private', 'watchlist', 'watched']],
            },
        },
    },
    {
        sequelize,
        underscored: true,
        timestamps: true,
        modelName: 'movieList',
    }
)

module.exports = MovieList
