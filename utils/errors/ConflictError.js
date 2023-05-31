const { ERROR_CODE_CONFLICT } = require('./constants');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = ERROR_CODE_CONFLICT;
  }
}

module.exports = ConflictError;
