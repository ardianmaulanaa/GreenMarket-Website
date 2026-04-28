const { Pool } = require('pg');

// koneksi PostgreSQL
const pool = new Pool({
  user: 'ardian',
  host: 'localhost',
  database: 'greenmarket',
  password: 'ardian123',
  port: 5434,
});

module.exports = { pool };
