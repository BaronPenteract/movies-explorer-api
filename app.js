const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const {
  celebrate, Joi, errors, Segments,
} = require('celebrate');

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

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
app.use(limiter);
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
