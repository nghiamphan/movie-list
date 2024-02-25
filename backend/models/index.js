const Movie = require('./movie')
const MovieList = require('./movieList')
const User = require('./user')

User.hasMany(MovieList)
MovieList.belongsTo(User)

Movie.sync({ alter: true })
MovieList.sync({ alter: true })
User.sync({ alter: true })

module.exports = { Movie, MovieList, User }
