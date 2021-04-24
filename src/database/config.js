require('dotenv').config();

module.exports = {
    development: {
      username: 'api',
      password: 'secret_password',
      database: 'projectApp_development',
      host: '127.0.0.1',
      dialect: 'postgres',
      use_env_variable: 'DEV_DATABASE_URL',
    },
    test: {
      username: 'api',
      password: 'secret_password',
      database: 'projectApp_test',
      host: '127.0.0.1',
      dialect: 'postgres',
      use_env_variable: 'TEST_DATABASE_URL',
    },
    production: {
      username: 'api',
      password: 'secret_password',
      database: 'projectApp_production',
      host: '127.0.0.1',
      dialect: 'postgres',
      use_env_variable: 'DATABASE_URL',
    },
};