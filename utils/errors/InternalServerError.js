const { ERROR_CODE_INTERNAL_SERVER } = require('./constants');

class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InternalServerError';
    this.statusCode = ERROR_CODE_INTERNAL_SERVER;
  }
}

module.exports = InternalServerError;
