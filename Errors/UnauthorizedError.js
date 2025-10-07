// import { UNAUTHORIZED_ERROR_CODE } from "../utils/errors";
const { UNAUTHORIZED_ERROR_CODE } = require("../utils/errors");

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED_ERROR_CODE;
  }
}

module.exports = UnauthorizedError;
