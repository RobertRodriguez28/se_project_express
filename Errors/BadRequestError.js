// import { BAD_REQUEST_ERROR_CODE } from "../utils/errors";
const { BAD_REQUEST_ERROR_CODE } = require("../utils/errors");
class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_REQUEST_ERROR_CODE;
  }
}

module.exports = BadRequestError;
