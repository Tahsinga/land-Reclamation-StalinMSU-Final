require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const db = require('./db')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, '../frontend')))

const authRoutes = require('./routes/auth')
const dataRoutes = require('./routes/data')
const motorRoutes = require('./routes/motor')

app.use('/api/auth', authRoutes)
app.use('/api/data', dataRoutes)
app.use('/api/motor', motorRoutes)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/landing.html'))
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})