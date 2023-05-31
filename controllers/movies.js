const {
  BadRequestError, NotFoundError, ForbiddenError, InternalServerError, errorMessages,
} = require('../utils/errors');

const Movie = require('../models/movie');

module.exports.createMovie = (req, res, next) => {
  const movieData = req.body;
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

  Movie.create({ ...movieData, owner: user._id })
    .then((movie) => movie.populate('owner'))
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError(errorMessages.BadRequest));
      } else {
        next(new InternalServerError(errorMessages.InternalServer));
      }
    });
};

module.exports.getMovies = (req, res, next) => {
  const { user } = req;

  Movie.find({})
    .populate('owner')
    .then((movies) => {
      const resData = movies.filter((movie) => movie.owner._id.toString() === user._id.toString());
      res.send(resData);
    })
    .catch(() => {
      next(new InternalServerError(errorMessages.InternalServer));
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const { user } = req;

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        return next(new NotFoundError(errorMessages.NotFound));
      }

      if (movie.owner._id.toString() !== user._id.toString()) {
        return next(new ForbiddenError(errorMessages.Forbidden));
      }

      return movie.deleteOne().then(() => res.send({ message: 'Фильм удален.' })).catch(() => {
        next(new InternalServerError(errorMessages.InternalServer));
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError(errorMessages.BadRequest));
      } else {
        next(new InternalServerError(errorMessages.InternalServer));
      }
    });
};
