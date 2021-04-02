const { registerValidator } = require("../../utils/validators");
const { InputError, 
        AlreadyAuthenticatedError,
        EmailAlreadyRegisteredError
} = require('../../utils/errors');

module.exports = {
    Mutation: {
        register: async (_, data, { redis, db, session, req, config }) => {
            const isValid = registerValidator(data);
            if(isValid != true) {
                const errorsMap = isValid.map((item) => ({ message: item.message, path: item.field }));
                throw new InputError({
                    data: { 
                        fields: errorsMap,
                        path: "register" 
                    },
                });
            }

            if(session.userId){
                throw new AlreadyAuthenticatedError({
                    data: {
                        path: "register"
                    }
                });
            }

            const userExist = await db.User.findOne({ where: { email: data.email } });
            if(userExist){
                throw new EmailAlreadyRegisteredError({
                    data: {
                        email: data.email,
                        path: "register"
                    }
                });
            }
            const user = await db.User.build(data);
            await user.save();

            session.userId = user.id;
            if(req.sessionID) {
                await redis.lpush(`${config.sessions.prefix}${user.id}`, req.sessionID);
            }

            return user;
        }
    }
}