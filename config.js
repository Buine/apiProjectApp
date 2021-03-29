module.exports = {
    redis: {
        connection: {
            // Default Configuration
            port: 6379,             // Redis port
            host: "127.0.0.1",      // Redis host
            family: 4,              // 4 (IPv4) or 6 (IPv6)
            password: null,
            db: 0,
        }
    },

    sessions: {
        name: "qid",
        prefix: "sess:",
        secret: "secret sessions key",
    }
}