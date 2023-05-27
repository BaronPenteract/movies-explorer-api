const router = require('express').Router();
const {
  celebrate, Joi, Segments,
} = require('celebrate');

const {
  getUserById,
  patchUser,
} = require('../controllers/users');

router.get('/me', getUserById);
router.patch('/me', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
  }),
}), patchUser);

module.exports = router;
