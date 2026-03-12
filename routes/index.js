const router = require('express').Router();
const { NOT_FOUND } = require('../utils/error');
const { createUser, userLogin } = require('../controllers/user');
const { validateUser, validateLogin } = require('../middlewares/validate');

const clothingItemsRouter = require('./clothingItems');
const usersRouter = require('./users');

router.post('/signup', validateUser, createUser);
router.post('/signin', validateLogin, userLogin);
router.use('/items', clothingItemsRouter);
router.use('/users', usersRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Router not found' });
});

module.exports = router;
