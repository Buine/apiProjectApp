const startServer = require('./server');

const port = process.env.PORT || 3000;

process.on('uncaughtException', (err) => {
    console.error(`${(new Date()).toUTCString()} uncaughtException:`, err);
    process.exit(0);
});

process.on('unhandledRejection', (err) => {
    console.error(`${(new Date()).toUTCString()} unhandledRejection:`, err);
});

startServer().then((server) => {
    server.listen({ port }, () => {
        console.clear();
        console.log(`🚀 Server ready at http://localhost:${port}/api`);
    })
})