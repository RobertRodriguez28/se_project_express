// const JWT_SECRET = "Secret";

// module.exports = { JWT_SECRET };
// require('dotenv').config();
const { JWT_SECRET = "super-strong-secret" } = process.env;

module.exports = {
  JWT_SECRET,
};
