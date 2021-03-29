const startServer = require('../../server');

module.exports = async () => {
    const port = process.env.PORT || 3000;
    const host = process.env.FRONTEND_HOST || "localhost";
    const server = await startServer();
    server.listen({ port }, () => {
        console.clear();
        console.log(`🚀 Server ready at http://${host}:${port}/api`);
    });
}