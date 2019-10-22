const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: process.env.DATABASE_URL || 'localhost',
  database: 'munchup'
});

module.exports = {
  query: (text, params) => {
    return pool.query(text, params);
  },
};
