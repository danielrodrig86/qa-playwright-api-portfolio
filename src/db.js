const { Pool } = require('pg')

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5433),
  database: process.env.DB_NAME || 'qa_portfolio',
  user: process.env.DB_USER || 'qa_user',
  password: process.env.DB_PASSWORD || 'qa_password'
})

module.exports = pool
