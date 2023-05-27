const router = require('express').Router();
const {
  celebrate, Joi, Segments,
} = require('celebrate');

const { URL_REGEXP } = require('../utils/constants');

const {
  getMovies, deleteMovie, createMovie,
} = require('../controllers/movies');

router.get('/', getMovies);

// post
router.post('/', celebrate({
  [Segments.BODY]: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().regex(URL_REGEXP).required(),
    trailerLink: Joi.string().regex(URL_REGEXP).required(),
    thumbnail: Joi.string().regex(URL_REGEXP).required(),
    /* owner: Joi.string().hex().length(24), */
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

// delete movie
router.delete('/:movieId', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
}), deleteMovie);

module.exports = router;
