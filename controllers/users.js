const bcrypt = require('bcryptjs');

const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  InternalServerError,
  ConflictError,
  errorMessages,
} = require('../utils/errors');

const { generateToken } = require('../utils/token');

const User = require('../models/user');

module.exports.getUserById = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError(errorMessages.NotFound));
      }
      return res.json(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(errorMessages.BadRequest));
      }

      return next(new InternalServerError(errorMessages.InternalServer));
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    })
      .then((user) => res.json(user)))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new BadRequestError(errorMessages.BadRequest));
      }

      if (err.code === 11000) {
        return next(new ConflictError(errorMessages.ConflictEmail));
      }

      return next(new InternalServerError(errorMessages.InternalServer));
    });
};

module.exports.patchUser = (req, res, next) => {
  const { name, email } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(
    _id,
    { name, email },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError(errorMessages.NotFound));
      }
      return res.json(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(errorMessages.BadRequest));
      } else if (err.code === 11000) {
        next(new ConflictError(errorMessages.ConflictEmail));
      } else {
        next(new InternalServerError(errorMessages.InternalServer));
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        next(new UnauthorizedError(errorMessages.UnauthorizedLogin));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            next(new UnauthorizedError(errorMessages.UnauthorizedLogin));
          }

          const token = generateToken(
            { _id: user._id, email: user.email },
            { expiresIn: '7d' },
          );

          res.json({ token });
        });
    })
    .catch(() => {
      next(new InternalServerError(errorMessages.InternalServer));
    });
};
