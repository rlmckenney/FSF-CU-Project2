const argon2 = require('argon2')
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    toJSON () {
      const attributes = super.toJSON()
      delete attributes.password
      return attributes
    }
  }

  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true }
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: { notEmpty: true }
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: { isEmail: true }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true, len: [6] }
      },
      avatarUrl: {
        type: DataTypes.STRING
      }
    },
    {
      sequelize,
      defaultScope: {
        attributes: { exclude: ['password'] }
      },
      scopes: {
        withPassword: { attributes: {} }
      }
    }
  )

  User.beforeSave(async user => {
    if (user.changed('password')) {
      user.password = await argon2.hash(user.password, {
        type: argon2.argon2d,
        memoryCost: 2 ** 20,
        hashLength: 50
      })
    }
  })

  return User
}
