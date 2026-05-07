const pool = require('../db')
const { spawn } = require('child_process')
const path = require('path')

// ===========================
// SECTION
// ===========================
const getSection = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM geospatial_db."Section"')
    res.json(result.rows)
  } catch (err) {
    console.error('SECTION ERROR:', err.message)
    res.status(500).json({ message: err.message })
  }
}

// ===========================
// BOREHOLES
// ===========================
const getBoreholes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM geospatial_db."BOREHOLES"')
    res.json(result.rows)
  } catch (err) {
    console.error('BOREHOLES ERROR:', err.message)
    res.status(500).json({ message: err.message })
  }
}

// ===========================
// SURVEY PILLAR MEASUREMENTS
// ===========================
const getSurveyMeasurements = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM geospatial_db."Survey_pillar_measurements"')
    res.json(result.rows)
  } catch (err) {
    console.error('SURVEY ERROR:', err.message)
    res.status(500).json({ message: err.message })
  }
}

const addSurveyMeasurement = async (req, res) => {
  const {
    Pillar_id, x_coordinate, y_coordinate,
    Pillar_height, Pillar_length, Pillar_area,
    Pillar_perimeter, pillar_elavation, Pillar_width,
    Pillar_depth, bord_width, effective_width
  } = req.body
  try {
    await pool.query(`
      INSERT INTO geospatial_db."Survey_pillar_measurements" (
        "Pillar_id", "x_coordinate", "y_coordinate",
        "Pillar_height", "Pillar_length", "Pillar_area",
        "Pillar_perimeter", "pillar _elavation", "Pillar_width",
        "Pillar_depth", "bord_width", "effective_width"
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [
        Pillar_id,
        x_coordinate || null,
        y_coordinate || null,
        Pillar_height || null,
        Pillar_length || null,
        Pillar_area || null,
        Pillar_perimeter || null,
        pillar_elavation || null,
        Pillar_width || null,
        Pillar_depth || null,
        bord_width || null,
        effective_width || null
      ]
    )
    res.status(201).json({ message: 'Survey measurement added successfully' })
  } catch (err) {
    console.error('ADD SURVEY ERROR:', err.message)
    res.status(500).json({ message: err.message })
  }
}

const updateSurveyMeasurement = async (req, res) => {
  const { id } = req.params
  const {
    Pillar_height, Pillar_length, Pillar_area,
    Pillar_perimeter, pillar_elavation, Pillar_width,
    Pillar_depth, bord_width, effective_width
  } = req.body
  try {
    await pool.query(`
      UPDATE geospatial_db."Survey_pillar_measurements" SET
        "Pillar_height"     = COALESCE(NULLIF($1, '')::numeric,  "Pillar_height"),
        "Pillar_length"     = COALESCE(NULLIF($2, '')::numeric,  "Pillar_length"),
        "Pillar_area"       = COALESCE(NULLIF($3, '')::numeric,  "Pillar_area"),
        "Pillar_perimeter"  = COALESCE(NULLIF($4, '')::numeric,  "Pillar_perimeter"),
        "pillar _elavation" = COALESCE(NULLIF($5, '')::numeric,  "pillar _elavation"),
        "Pillar_width"      = COALESCE(NULLIF($6, '')::numeric,  "Pillar_width"),
        "Pillar_depth"      = COALESCE(NULLIF($7, '')::numeric,  "Pillar_depth"),
        "bord_width"        = COALESCE(NULLIF($8, '')::numeric,  "bord_width"),
        "effective_width"   = COALESCE(NULLIF($9, '')::numeric,  "effective_width")
      WHERE "Pillar_id" = $10`,
      [
        Pillar_height   || '',
        Pillar_length   || '',
        Pillar_area     || '',
        Pillar_perimeter || '',
        pillar_elavation || '',
        Pillar_width    || '',
        Pillar_depth    || '',
        bord_width      || '',
        effective_width || '',
        id
      ]
    )
    res.json({ message: 'Survey measurement updated successfully' })
  } catch (err) {
    console.error('UPDATE SURVEY ERROR:', err.message)
    res.status(500).json({ message: err.message })
  }
}

// ===========================
// GEOLOGICAL
// ===========================
const getGeological = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM geospatial_db."Geological_table"')
    res.json(result.rows)
  } catch (err) {
    console.error('GEOLOGICAL ERROR:', err.message)
    res.status(500).json({ message: err.message })
  }
}

const addGeological = async (req, res) => {
  const body = req.body
  try {
    const columns = Object.keys(body).map(k => `"${k}"`).join(', ')
    const values = Object.values(body).map(v => v === '' ? null : v)
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ')
    await pool.query(
      `INSERT INTO geospatial_db."Geological_table" (${columns}) VALUES (${placeholders})`,
      values
    )
    res.status(201).json({ message: 'Geological record added successfully' })
  } catch (err) {
    console.error('ADD GEOLOGICAL ERROR:', err.message)
    res.status(500).json({ message: err.message })
  }
}

const updateGeological = async (req, res) => {
  const { id } = req.params
  const body = req.body
  try {
    const keys = Object.keys(body)
    const values = Object.values(body).map(v => v === '' ? null : v)
    const setClause = keys.map((k, i) => `"${k}" = $${i + 1}`).join(', ')
    values.push(id)
    await pool.query(
      `UPDATE geospatial_db."Geological_table" SET ${setClause} WHERE id = $${values.length}`,
      values
    )
    res.json({ message: 'Geological record updated successfully' })
  } catch (err) {
    console.error('UPDATE GEOLOGICAL ERROR:', err.message)
    res.status(500).json({ message: err.message })
  }
}

// ===========================
// GEOTECHNICAL
// ===========================
const getGeotechnical = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM geospatial_db."geotechnical_table"')
    res.json(result.rows)
  } catch (err) {
    console.error('GEOTECHNICAL ERROR:', err.message)
    res.status(500).json({ message: err.message })
  }
}

const addGeotechnical = async (req, res) => {
  const body = req.body
  try {
    const columns = Object.keys(body).map(k => `"${k}"`).join(', ')
    const values = Object.values(body).map(v => v === '' ? null : v)
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ')
    await pool.query(
      `INSERT INTO geospatial_db."geotechnical_table" (${columns}) VALUES (${placeholders})`,
      values
    )
    res.status(201).json({ message: 'Geotechnical record added successfully' })
  } catch (err) {
    console.error('ADD GEOTECHNICAL ERROR:', err.message)
    res.status(500).json({ message: err.message })
  }
}

const updateGeotechnical = async (req, res) => {
  const { id } = req.params
  const body = req.body
  try {
    const keys = Object.keys(body)
    const values = Object.values(body).map(v => v === '' ? null : v)
    const setClause = keys.map((k, i) => `"${k}" = $${i + 1}`).join(', ')
    values.push(id)
    await pool.query(
      `UPDATE geospatial_db."geotechnical_table" SET ${setClause} WHERE id = $${values.length}`,
      values
    )
    res.json({ message: 'Geotechnical record updated successfully' })
  } catch (err) {
    console.error('UPDATE GEOTECHNICAL ERROR:', err.message)
    res.status(500).json({ message: err.message })
  }
}

const queryTable = async (table, pillarIds) => {
  if (pillarIds && pillarIds.length) {
    const result = await pool.query(
      `SELECT * FROM geospatial_db."${table}" WHERE "Pillar_id" = ANY($1)`,
      [pillarIds]
    )
    return result
  }
  return pool.query(`SELECT * FROM geospatial_db."${table}"`)
}

const getPillarIds = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT "Pillar_id" FROM geospatial_db."Survey_pillar_measurements"
      UNION
      SELECT DISTINCT "Pillar_id" FROM geospatial_db."Geological_table"
      UNION
      SELECT DISTINCT "Pillar_id" FROM geospatial_db."geotechnical_table"
      ORDER BY "Pillar_id"
    `)
    res.json({ ids: result.rows.map(r => r.Pillar_id) })
  } catch (err) {
    console.error('PILLAR IDS ERROR:', err.message)
    res.status(500).json({ message: err.message })
  }
}

const analyzePillars = async (req, res) => {
  try {
    const pillarIds = Array.isArray(req.body.pillarIds) && req.body.pillarIds.length ? req.body.pillarIds : null

    const surveyResult = await queryTable('Survey_pillar_measurements', pillarIds)
    const geoResult = await queryTable('Geological_table', pillarIds)
    const geotechResult = await queryTable('geotechnical_table', pillarIds)

    const pillarMap = {}

    const ensureRow = (row) => {
      const id = row.Pillar_id || row.pillar_id || row.id || row.ID
      if (!id) return null
      if (!pillarMap[id]) pillarMap[id] = { Pillar_id: id }
      return pillarMap[id]
    }

    surveyResult.rows.forEach(row => {
      const pillar = ensureRow(row)
      if (pillar) pillar.survey = row
    })
    geoResult.rows.forEach(row => {
      const pillar = ensureRow(row)
      if (pillar) pillar.geological = row
    })
    geotechResult.rows.forEach(row => {
      const pillar = ensureRow(row)
      if (pillar) pillar.geotechnical = row
    })

    const pillars = Object.values(pillarMap)
    const analysis = await runPythonAnalysis(pillars)
    res.json(analysis)
  } catch (err) {
    console.error('ANALYZE PILLARS ERROR:', err.message)
    res.status(500).json({ message: err.message })
  }
}

const runPythonAnalysis = (pillars) => {
  return new Promise((resolve, reject) => {
    const pythonPath = process.env.PYTHON || 'python'
    const scriptPath = path.join(__dirname, '../analysis.py')
    const python = spawn(pythonPath, [scriptPath], { env: { ...process.env } })

    let output = ''
    let error = ''

    python.stdout.on('data', (data) => { output += data.toString() })
    python.stderr.on('data', (data) => { error += data.toString() })

    python.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`Python analysis failed: ${error || 'exit code ' + code}`))
      }
      try {
        const start = output.indexOf('{')
        const end = output.lastIndexOf('}')
        if (start === -1 || end === -1 || end <= start) {
          throw new Error('Invalid JSON response from analysis script')
        }
        const parsed = JSON.parse(output.slice(start, end + 1))
        resolve(parsed)
      } catch (parseErr) {
        reject(new Error(`Failed to parse analysis output: ${parseErr.message}. Response: ${output}`))
      }
    })

    python.stdin.write(JSON.stringify({ pillars }))
    python.stdin.end()
  })
}

// ===========================
// EXPORTS
// ===========================
module.exports = {
  getSection,
  getBoreholes,
  getSurveyMeasurements,
  addSurveyMeasurement,
  updateSurveyMeasurement,
  getGeological,
  addGeological,
  updateGeological,
  getGeotechnical,
  addGeotechnical,
  updateGeotechnical,
  getPillarIds,
  analyzePillars
}