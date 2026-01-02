const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  BAD_REQUEST_CODE,
  DEFAULT_ERROR_CODE,
  NOT_FOUND,
  CONFLICT,
  INCORRECT_CREDENTIALS,
} = require('../utils/error');

const { JWT_SECRET } = require('../utils/config');

const getUsers = (req, res) =>
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() =>
      res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: `${DEFAULT_ERROR_CODE}: Generic Server Error` }),
    );

const createUser = (req, res) => {
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
          return res
            .status(BAD_REQUEST_CODE)
            .send({ message: 'Error: Invalid data' });
        }
        if (err.code === 11000) {
          return res
            .status(CONFLICT)
            .send({ message: 'Error: Email already exists' });
        }
        return res
          .status(DEFAULT_ERROR_CODE)
          .send({ message: `${DEFAULT_ERROR_CODE}: Server Error` });
      }),
  );
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;
  return User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Invalid User ID: User ID not found' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'User not found' });
      }
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: `${DEFAULT_ERROR_CODE}: Server Error` });
    });
};

const userLogin = (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(BAD_REQUEST_CODE).send({ message: 'Email is required' });
  }
  if (!password) {
    return res
      .status(BAD_REQUEST_CODE)
      .send({ message: 'Password is required' });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      res.status(200).send({ message: 'Login successful', data: user, token });
    })
    .catch((err) =>
      res.status(INCORRECT_CREDENTIALS).send({ message: err.message }),
    );
};

const modifyUser = (req, res) => {
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
        return res.status(NOT_FOUND).send({ message: 'User not found' });
      }
      return res.status(200).send({ data: updatedUser });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Error: Invalid data for user update' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'User not found' });
      }
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: `${DEFAULT_ERROR_CODE}: Server Error` });
    });
};

module.exports = {
  getUsers,
  createUser,
  getCurrentUser,
  userLogin,
  modifyUser,
};
