const jwt = require("jsonwebtoken")
const jwtSecret = "s1"

const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, jwtSecret, { expiresIn: "60s" })
}

const verifyToken = (token) => {
  return jwt.verify(token, jwtSecret);
}

module.exports = {
  generateToken,
  verifyToken,
}