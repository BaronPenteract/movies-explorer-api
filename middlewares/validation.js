const {
  celebrate, Joi, Segments,
} = require('celebrate');

const { URL_REGEXP } = require('../utils/constants');

const loginValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const registerValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const movieValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    country: Joi.string().min(2).required(),
    director: Joi.string().min(2).max(30).required(),
    duration: Joi.number().required(),
    year: Joi.string().length(4).required(),
    description: Joi.string().required(),
    image: Joi.string().regex(URL_REGEXP).required(),
    trailerLink: Joi.string().regex(URL_REGEXP).required(),
    thumbnail: Joi.string().regex(URL_REGEXP).required(),
    /* owner: Joi.string().hex().length(24), */
    movieId: Joi.number().required(),
    nameRU: Joi.string().min(1).required(),
    nameEN: Joi.string().min(1).required(),
  }),
});

const movieIdValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
});

const userValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
  }),
});

module.exports = {
  loginValidation, registerValidation, movieValidation, movieIdValidation, userValidation,
};
