const resolvers = {
    Query: {
        hello: async (parent, args, context, info) => { 
            console.log(`[Database Name]: ${context.db.sequelize.getDatabaseName()}`);
            console.log(`[Session]: ${context.session}`);
            console.log(`[SessionID]: ${context.req.sessionID}`);
            console.log(`[Prefix-Session]: "${context.config.sessions.prefix}" edit in config.js\n`);
            return `Hello world!`;
        },
    },
};

module.exports = resolvers;