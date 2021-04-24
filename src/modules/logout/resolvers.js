const { removeAllUsersSessions } = require('../../utils/removeAllUserSessions');
const applyMiddleware = require("../../utils/applyMiddleware");
const middleware = require("../../utils/middlewareSession");

module.exports = {
    Mutation: {
        logout: applyMiddleware(middleware, async (_, __, { redis, db, req, session, config }) => {
            let logoutStatus = true;
            await removeAllUsersSessions(session.userId, redis, config);
            return logoutStatus;
        })
    }
}