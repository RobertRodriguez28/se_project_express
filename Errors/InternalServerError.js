// import { INTERNAL_SERVER_ERROR_CODE } from "../utils/errors";
const { INTERNAL_SERVER_ERROR_CODE } = require("../utils/errors");
class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = INTERNAL_SERVER_ERROR_CODE;
  }
}

module.exports = InternalServerError;
