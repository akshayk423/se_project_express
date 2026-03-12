const router = require('express').Router();
const { createUser, userLogin } = require('../controllers/user');
const { validateUser, validateLogin } = require('../middlewares/validate');
const NotFoundError = require('../errors/not-found-err');

const clothingItemsRouter = require('./clothingItems');
const usersRouter = require('./users');

router.post('/signup', validateUser, createUser);
router.post('/signin', validateLogin, userLogin);
router.use('/items', clothingItemsRouter);
router.use('/users', usersRouter);

router.use((req, res, next) => {
  next(new NotFoundError('Router not found'));
});

module.exports = router;
