const { Redis } = require("ioredis");

module.exports = {
    /**
     * Elimina todas las sessiones de un usuario
     * @param { string } userId  
     * @param { Redis } redis 
     * @param { * } config 
     */
    removeAllUsersSessions : async (userId, redis, config) => {
        const sessionIds = await redis.lrange(`${config.sessions.prefix}${userId}`, 0, -1);
        let promises = [];
        for(let i = 0; i < sessionIds.length; i++) {
            promises.push(redis.del(`${sessionIds[i]}`));
        };
        await Promise.all(promises); 
    }
}