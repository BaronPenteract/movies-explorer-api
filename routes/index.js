const router = require('express').Router();

const routerUsers = require('./users');
const routerMovies = require('./movies');

router.use('/users', routerUsers);
router.use('/movies', routerMovies);

module.exports = router;
