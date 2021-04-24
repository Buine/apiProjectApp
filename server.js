const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { formatError } = require('apollo-errors');
const cors = require('cors');
const session = require('express-session');
const connectRedis = require('connect-redis');
const Redis = require('ioredis');

const genSchema = require('./src/utils/generateSchema');
const db = require("./src/database/index");
const config = require("./config");
const router = require('./src/routes/router');

// Consts
const env = process.env.NODE_ENV || 'development';      // Variable de entorno
const app = express();
const redis = new Redis(config.redis.connection);

const RedisStore = connectRedis(session);

const startServer = async () => {

    // Database Sync
    await db.sequelize.sync({ force: env === 'test' });

    // Server Config
    const server = new ApolloServer({ 
        schema: genSchema(),
        formatError, 
        context: ({ req }) => ({ 
            redis,
            db,
            config,
            session: req.session,
            req,
        }),
    });

    // CORS
    app.use(cors({
        origin: env === 'test' ? '*' :  process.env.FRONTEND_HOST
    }));

    // Sessions
    app.use(
        session({
            name: config.sessions.name,
            store: new RedisStore({
                client: redis,
                prefix: config.sessions.prefix
            }),
            secret: config.sessions.secret,
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days 
            }
        })
    );

    server.applyMiddleware({ app, path: '/api' });
    app.use(router(redis, db, config)); // Routes
    return app;
}


module.exports = startServer;