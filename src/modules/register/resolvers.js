const { ApolloError } = require("apollo-server-errors");
const { registerValidator } = require("../../utils/validators");

module.exports = {
    Mutation: {
        register: async (_, data, { redis, db, session, req, config }) => {
            const isValid = registerValidator(data);
            if(isValid != true) {
                const errorsMap = isValid.map((item) => ({ message: item.message, path: item.field }));
                throw new ApolloError(`Field or fields invalid`, "INPUT_ERR", {
                    error: errorsMap
                });
            }

            if(session.userId){
                throw new ApolloError('You already have an active session', "ACTIVE_SESSION");
            }

            const userExist = await db.User.findOne({ where: { email: data.email } });
            if(userExist){
                throw new ApolloError(`User has already exist`, "USER_EXIST", { email: data.email });
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