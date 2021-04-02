const { loginValidator } = require("../../utils/validators");
const { InputError, 
        AlreadyAuthenticatedError, 
        UserNotExistError, 
        BadPasswordError 
} = require('../../utils/errors');
const bcrypt = require('bcryptjs');

module.exports = {
    Mutation: {
        login: async (_, data, { redis, db, req, session, config }) => {
            const isValid = loginValidator(data);
            if(isValid != true) {
                const errorsMap = isValid.map((err) => ({ message: err.message, path: err.field }));
                throw new InputError({
                    data: { 
                        fields: errorsMap,
                        path: "login" 
                    },
                });
            }

            if(session.userId){
                throw new AlreadyAuthenticatedError({
                    data: {
                        path: "login"
                    }
                });
            }

            const user = await db.User.findOne({ where: { email: data.email } });
            if(!user) {
                throw new UserNotExistError({
                    data: {
                        email: data.email,
                        path: "login"
                    }
                });
            }
            
            const verify = await bcrypt.compare(data.password, user.password);
            if(!verify) {
                throw new BadPasswordError({
                    data: {
                        email: data.email,
                        path: "login"
                    }
                });
            }

            session.userId = user.id;
            if(req.sessionID) {
                await redis.lpush(`${config.sessions.prefix}${user.id}`, req.sessionID);
            }

            return user;
        }
    }
}