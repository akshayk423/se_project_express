const router = require('express').Router();
const { NOT_FOUND } = require('../utils/error');

const clothingItemsRouter = require('./clothingItems');
const usersRouter = require('./users');

router.use('/items', clothingItemsRouter);
router.use('/users', usersRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Router not found' });
});

module.exports = router;
