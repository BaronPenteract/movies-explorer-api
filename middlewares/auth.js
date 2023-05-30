const { checkToken } = require('../utils/token');
const { UnauthorizedError, errorMessages } = require('../utils/errors');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  try {
    const token = authorization.replace('Bearer ', '');

    const payload = checkToken(token);

    if (!payload) {
      throw new UnauthorizedError(errorMessages.Unauthorized);
    }

    req.user = payload;

    next();
  } catch (err) {
    next(new UnauthorizedError(errorMessages.Unauthorized));
  }
};

module.exports = auth;
