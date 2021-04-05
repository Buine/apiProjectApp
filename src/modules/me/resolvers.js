const applyMiddleware = require("../../utils/applyMiddleware");
const middleware = require("../../utils/middlewareSession");

module.exports = {
    Query: {
        me: applyMiddleware(middleware, async (_, __, { session, db }) => {
            const user = await db.User.findOne({ where: { id: session.userId } });
            return user;
        }),
    }
}