const pool = require('./db')

async function test() {
  try {
    const result = await pool.query(`
      SELECT current_database(), current_schema()
    `)
    console.log('Connected to:', result.rows)

    const tables = await pool.query(`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
    `)
    console.log('All tables:', tables.rows)
  } catch (err) {
    console.log('ERROR:', err.message)
  }
  process.exit()
}

test()