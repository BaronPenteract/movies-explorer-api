const { ERROR_CODE_BAD_REQUEST } = require('./constants');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = ERROR_CODE_BAD_REQUEST;
  }
}

module.exports = BadRequestError;
