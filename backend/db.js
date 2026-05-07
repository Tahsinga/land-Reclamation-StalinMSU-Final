const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})

pool.on('error', (err) => {
  console.error('Unexpected database error:', err.message)
})

async function initializeDatabase() {
  try {
    const client = await pool.connect()
    try {
      await client.query('SET search_path TO geospatial_db, public')
      console.log('Database connected successfully ✅')
    } finally {
      client.release()
    }
  } catch (err) {
    console.error('Database connection FAILED:', err.message)
  }
}

initializeDatabase()

module.exports = pool