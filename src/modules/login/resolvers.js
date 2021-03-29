const { ApolloError } = require("apollo-server-errors");
const { loginValidator } = require("../../utils/validators");
const bcrypt = require('bcryptjs');

module.exports = {
    Mutation: {
        login: async (_, data, { redis, db, req, session, config }) => {
            const isValid = loginValidator(data);
            if(isValid != true) {
                const error = isValid.map((err) => ({ message: err.message, path: err.field }));
                throw new ApolloError('Field or fields invalid', 'INPUT_ERR',{
                    error
                });
            }

            if(session.userId){
                throw new ApolloError('You already have an active session', "ACTIVE_SESSION");
            }

            const user = await db.User.findOne({ where: { email: data.email } });
            if(!user) {
                throw new ApolloError('Email not register', 'INVALID_LOGIN', {
                    email: data.email
                });
            }
            
            const verify = await bcrypt.compare(data.password, user.password);
            if(!verify) {
                throw new ApolloError('Password incorrect', 'INVALID_LOGIN', {
                    password: 'invalid'
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