const JWT = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const SECRET_KEY = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';

const generateToken = (payload, options) => JWT.sign(payload, SECRET_KEY, options);

const checkToken = (token) => {
  if (!token) {
    return false;
  }

  try {
    return JWT.verify(token, SECRET_KEY);
  } catch (e) {
    return false;
  }
};

module.exports = { generateToken, checkToken };
