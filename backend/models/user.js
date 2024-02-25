const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class User extends Model {}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING(32),
            unique: true,
            allowNull: false,
        },
        passwordHash: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
    },
    {
        sequelize,
        underscored: true,
        timestamps: true,
        modelName: 'user',
        hooks: {
            afterCreate: async (user) => {
                delete user.dataValues.passwordHash
                delete user.dataValues.createdAt
                delete user.dataValues.updatedAt
            },
        },
    }
)

module.exports = User
