require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI
const PORT = process.env.PORT || 3003

module.exports = {
  MONGODB_URI,
  PORT,
}
