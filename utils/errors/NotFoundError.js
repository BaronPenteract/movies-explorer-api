const { ERROR_CODE_NOT_FOUND } = require('./constants');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = ERROR_CODE_NOT_FOUND;
  }
}

module.exports = NotFoundError;
