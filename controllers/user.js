const User = require('../models/user');
const {
  BAD_REQUEST_CODE,
  DEFAULT_ERROR_CODE,
  NOT_FOUND,
} = require('../utils/error');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => res
      .status(DEFAULT_ERROR_CODE)
      .send({ message: `${DEFAULT_ERROR_CODE}: Generic Server Error` }));
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Error: Invalid data' });
      }
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: `${DEFAULT_ERROR_CODE}: Server Error` });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
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

module.exports = {
  getUsers,
  createUser,
  getUserById,
};
