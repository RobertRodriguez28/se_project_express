// import { CONFLICT_ERROR_CODE } from "../utils/errors";
const { CONFLICT_ERROR_CODE } = require("../utils/errors");

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLICT_ERROR_CODE;
  }
}

module.exports = ConflictError;
