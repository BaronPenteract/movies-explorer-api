const router = require('express').Router();

const { movieValidation, movieIdValidation } = require('../middlewares/validation');

const {
  getMovies, deleteMovie, createMovie,
} = require('../controllers/movies');

router.get('/', getMovies);

// post
router.post('/', movieValidation, createMovie);

// delete movie
router.delete('/:movieId', movieIdValidation, deleteMovie);

module.exports = router;
