const { ERROR_CODE_UNAUTHORIZED } = require('./constants');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = ERROR_CODE_UNAUTHORIZED;
  }
}

module.exports = UnauthorizedError;
