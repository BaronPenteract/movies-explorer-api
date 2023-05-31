const router = require('express').Router();

const { userValidation } = require('../middlewares/validation');

const {
  getUserById,
  patchUser,
} = require('../controllers/users');

router.get('/me', getUserById);
router.patch('/me', userValidation, patchUser);

module.exports = router;
