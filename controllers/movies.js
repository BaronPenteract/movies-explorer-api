const {
  BadRequestError, NotFoundError, ForbiddenError, InternalServerError,
} = require('../utils/errors');

const Movie = require('../models/movie');

module.exports.createMovie = (req, res, next) => {
  const movie = req.body;
  /* const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN, } = movie; */
  const { user } = req;

  Movie.create({ ...movie, owner: user._id })
    .then((movie) => movie.populate('owner'))
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные.'));
      } else {
        next(new InternalServerError('Что-то пошло не так.'));
      }
    });
};

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .populate('owner')
    .then((movies) => res.send(movies))
    .catch(() => {
      next(new InternalServerError('Что-то пошло не так.'));
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const { user } = req;

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        return next(new NotFoundError('Фильм с таким id не найден.'));
      }

      if (movie.owner._id.toString() !== user._id.toString()) {
        return next(new ForbiddenError('Вы не являетесь владельцем.'));
      }

      return movie.deleteOne().then(() => res.send({ message: `Фильм удален.` })).catch(() => {
        next(new InternalServerError('Что-то пошло не так.'));
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные.'));
      } else {
        next(new InternalServerError('Что-то пошло не так.'));
      }
    });
};
