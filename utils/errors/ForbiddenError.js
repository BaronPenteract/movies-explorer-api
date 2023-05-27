const { ERROR_CODE_FORBIDDEN } = require('./constants');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = ERROR_CODE_FORBIDDEN;
  }
}

module.exports = ForbiddenError;
