require('dotenv').config();

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const modelsPath = path.join(__dirname, '/models');     // Path de la carpeta models
const env = process.env.NODE_ENV || 'development';      // Variable de entorno

const config = require('./config')[env];

const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    logging: false
});

/**
 * Se leen todos los archivos .js en la carpeta models, para ser importados 
 */
fs.readdirSync(modelsPath)
    .filter((file) => (
        !file.includes(".")
    ))
    .forEach((folder) => {
        const model = require(path.join(modelsPath, `./${folder}/${folder}.js`))(sequelize)
        db[model.name] = model;
    });


Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;