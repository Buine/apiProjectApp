const { 
    NotAuthenticatedError
} = require('./errors');

module.exports = async (resolver, parent, args, context, info) => {
    const { redis, session } = context;
    if(!session.userId){
        throw new NotAuthenticatedError({
            data: {
                reason: "not-cookie",
                path: "middleware"
            }
        });
    }
    const sessions = await redis.lrange(`${context.config.sessions.prefix}${context.session.userId}`, 0, -1);
    if(!sessions.includes(context.req.sessionID)) {
        delete session.userId;
        throw new NotAuthenticatedError({
            data: {
                reason: "cookie-invalid",
                path: "middleware"
            }
        });
    }
    return await resolver(parent, args, context, info);
}