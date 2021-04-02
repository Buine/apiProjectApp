const { 
    NotAuthenticatedError
} = require('../../utils/errors');
const { removeAllUsersSessions } = require('../../utils/removeAllUserSessions');

module.exports = {
    Mutation: {
        logout: async (_, __, { redis, db, req, session, config }) => {
            let logoutStatus = true;
            if(!session.userId){
                logoutStatus = false;
                throw new NotAuthenticatedError({
                    data: {
                        path: "logout"
                    }
                });
            }
            await removeAllUsersSessions(session.userId, redis, config);
            return logoutStatus;
        }
    }
}