const pool = require('../db')

// ===========================
// MOTOR CONTROL
// ===========================
const activateMotor = async (req, res) => {
  try {
    // For now, just return success - ESP32 integration would go here
    console.log('Motor activation requested by user:', req.user?.fullname || 'Unknown')

    // TODO: Add ESP32 GPIO control logic here
    // GPIO 12 and 13 control would be implemented here

    res.json({
      message: 'Motor activated successfully',
      status: 'ON',
      gpio12: 'HIGH',
      gpio13: 'HIGH',
      timestamp: new Date().toISOString()
    })
  } catch (err) {
    console.error('MOTOR ACTIVATION ERROR:', err.message)
    res.status(500).json({ message: err.message })
  }
}

module.exports = {
  activateMotor
}