const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

const helmet = require('helmet');
const {
  celebrate, Joi, errors, Segments,
} = require('celebrate');

const rateLimiter = require('./middlewares/rateLimiter');
const auth = require('./middlewares/auth');

const errorHandler = require('./utils/errorHandler');
const {
  createUser,
  login,
} = require('./controllers/users');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');

const { NotFoundError } = require('./utils/errors');

const routerUsers = require('./routes/users');
const routerMovies = require('./routes/movies');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb');

// Apply the rate limiting middleware to all requests
app.use(rateLimiter);
app.use(helmet());

app.use(requestLogger);
app.use(cors);

app.post('/signin', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use('/movies', auth, routerMovies);
app.use('/users', auth, routerUsers);

app.use(errorLogger);

app.use(errors());

app.use(auth, (req, res, next) => {
  next(new NotFoundError('Некорректный запрос'));
});

app.use(errorHandler);

app.listen(PORT);
