const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');

const { JWT_SECRET } = require('../utils/config');

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  return bcrypt.hash(password, 10).then((hash) =>
    User.create({
      name,
      avatar,
      email,
      password: hash,
    })
      .then((user) => {
        const createdUser = user.toObject();
        delete createdUser.password;
        res.status(201).send({ data: createdUser });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          return next(new BadRequestError('Error: Invalid data'));
        }
        if (err.code === 11000) {
          return next(new ConflictError('Error: Email already exists'));
        }
        return next(err);
      }),
  );
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  return User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Invalid User ID: User ID not found'));
      }
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('User not found'));
      }
      return next(err);
    });
};

const userLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return next(new BadRequestError('Email is required'));
  }
  if (!password) {
    return next(new BadRequestError('Password is required'));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      res.status(200).send({ message: 'Login successful', data: user, token });
    })
    .catch((err) => next(err));
};

const modifyUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  return User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((updatedUser) => {
      if (!updatedUser) {
        return next(new NotFoundError('User not found'));
      }
      return res.status(200).send({ data: updatedUser });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Error: Invalid data for user update'));
      }
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('User not found'));
      }
      return next(err);
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  userLogin,
  modifyUser,
};
