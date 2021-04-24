const express = require('express');
const resetPassword = require('./resetPassword');
var router = express.Router();
var redis, db, config;

const initRouter = () => {
    router.use('/resetPassword', resetPassword(redis, db, config));
}

module.exports = (redisAux, dbAux, configAux) => {
    redis = redisAux;
    db = dbAux;
    config = configAux;
    initRouter();
    return router
};