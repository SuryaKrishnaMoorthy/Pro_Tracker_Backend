if (process.env.NODE_ENV !== 'production') require('dotenv').load();

const path = require('path');

const config = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: path.join(__dirname, 'src', 'db', 'migrations')
  },
  seeds: {
    directory: path.join(__dirname, 'src', 'db', 'seeds')
  }
};

module.exports = {
  development: config,
  production: config
};
