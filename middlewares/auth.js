const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const { INCORRECT_CREDENTIALS } = require('../utils/error');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(INCORRECT_CREDENTIALS)
      .send({ message: 'Authorization required' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(INCORRECT_CREDENTIALS)
      .send({ message: 'Authorization required' });
  }

  req.user = payload;

  return next();
};

module.exports = auth;
