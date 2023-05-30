const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

const helmet = require('helmet');
const { errors } = require('celebrate');

const rateLimiter = require('./middlewares/rateLimiter');
const auth = require('./middlewares/auth');

const errorHandler = require('./utils/errorHandler');
const { createUser, login } = require('./controllers/users');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');
const {
  loginValidation, registerValidation,
} = require('./middlewares/validation');

const { DB_URL } = require('./utils/mongoDBConfig');
const { NotFoundError, errorMessages } = require('./utils/errors');

const routes = require('./routes');

const { PORT = 3000, DB = DB_URL } = process.env;
const app = express();

app.use(express.json());

mongoose.connect(DB);

app.use(requestLogger);

// Apply the rate limiting middleware to all requests
app.use(rateLimiter);
app.use(helmet());

app.use(cors);

app.post(
  '/signin',
  loginValidation,
  login,
);

app.post(
  '/signup',
  registerValidation,
  createUser,
);

app.use('/', auth, routes);

app.use(errors());

app.use(auth, (req, res, next) => {
  next(new NotFoundError(errorMessages.NotFound));
});

app.use(errorLogger);

app.use(errorHandler);

app.listen(PORT);
