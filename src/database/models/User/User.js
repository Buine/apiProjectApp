const bcrypt = require('bcryptjs');
const { v4 } = require('uuid');
const { Sequelize, DataTypes, Model } = require('sequelize');

/**
 * Model User
 * @param { Sequelize } sequelize 
 */
module.exports = (sequelize) => {
    const User = sequelize.define('User',{
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: { type: DataTypes.STRING } ,
        confirmed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        status: {
            type: DataTypes.SMALLINT,
            defaultValue: 0,
        } 
    },{
        tableName: "User",
        schema: "public",
    });

    User.beforeCreate(async (user) => {
        user.id = v4();
        user.password = await bcrypt.hash(user.password, 10);
    });

    /**
     * Se crean las relaciones de los modelos
     * @param { { model: Model, sequelize: Sequelize } } models  Objecto con los modelos y conexion
     */
    User.associate = (models) => {
        // Se añaden las relaciones que tendran las tablas.
    }

    return User;
}