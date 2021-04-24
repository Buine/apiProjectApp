const { forgetPasswordValidator } = require("../../utils/validators")
const { v4 } = require('uuid');
const Redis = require('ioredis');

module.exports = {
    Mutation: {
        forgetPassword: async (_, { email }, { db, redis, config }) => {
            const isValid = forgetPasswordValidator({ email });
            if(isValid != true) {
                const errorsMap = isValid.map((err) => ({ message: err.message, path: err.field }));
                throw new InputError({
                    data: { 
                        fields: errorsMap,
                        path: "forgetPassword" 
                    },
                });
            }
            const user = await db.User.findOne({ where: { email } });
            if(user) {
                const token = `${config.tokens.prefix}${v4()}`;
                /** @type { Redis.Commands } redis */
                let r = redis;
                await r.set(`${token}`, `${user.id}`, "EX", config.tokens.expiration);
                console.log(`[Token forgetPassword]: ${token}`);
                // Create token in REDIS
                // And send for email
                // Or SMS
            }
            return true;
        }
    }
}