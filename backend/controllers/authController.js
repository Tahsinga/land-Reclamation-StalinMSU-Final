const pool = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
  const { fullname, email, employeeId, password, role } = req.body

  try {
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1', [email]
    )

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await pool.query(
      'INSERT INTO users (fullname, email, employee_id, password, role) VALUES ($1, $2, $3, $4, $5)',
      [fullname, email, employeeId, hashedPassword, role]
    )

    res.status(201).json({ message: 'Account created successfully' })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

const login = async (req, res) => {
  const { email, password, role } = req.body

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1', [email]
    )

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const user = result.rows[0]

    if (user.role !== role) {
      return res.status(400).json({ message: `This account is not registered as a ${role}` })
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, fullname: user.fullname },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )

    res.json({
      token,
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        role: user.role
      }
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { register, login }