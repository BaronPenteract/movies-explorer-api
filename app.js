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

const { NotFoundError } = require('./utils/errors');

const routerUsers = require('./routes/users');
const routerMovies = require('./routes/movies');

const { PORT = 3000, DB = 'bitfilmsdb' } = process.env;
const app = express();

app.use(express.json());

mongoose.connect(`mongodb://127.0.0.1:27017/${DB}`);

// Apply the rate limiting middleware to all requests
app.use(rateLimiter);
app.use(helmet());

app.use(requestLogger);
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

app.use('/movies', auth, routerMovies);
app.use('/users', auth, routerUsers);

app.use(errorLogger);

app.use(errors());

app.use(auth, (req, res, next) => {
  next(new NotFoundError('Некорректный запрос'));
});

app.use(errorHandler);

app.listen(PORT);
