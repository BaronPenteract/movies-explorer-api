const { checkToken } = require('../utils/token');
const { UnauthorizedError } = require('../utils/errors');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  try {
    const token = authorization.replace('Bearer ', '');

    const payload = checkToken(token);

    if (!payload) {
      throw new UnauthorizedError('Доступ запрещен.');
    }

    req.user = payload;

    next();
  } catch (err) {
    next(new UnauthorizedError('Доступ запрещен.'));
  }
};

module.exports = auth;
