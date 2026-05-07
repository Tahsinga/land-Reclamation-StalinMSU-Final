const jwt = require('jsonwebtoken')

function verifyToken(req, res, next) {
  const token = req.headers['authorization']
  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

function allowRoles(role1, role2, role3) {
  const roles = [role1, role2, role3].filter(Boolean)
  return function(req, res, next) {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied for your role' })
    }
    next()
  }
}

exports.verifyToken = verifyToken
exports.allowRoles = allowRoles