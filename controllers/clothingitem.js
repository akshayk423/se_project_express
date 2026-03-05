const Items = require('../models/clothingitem');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

// get all clothing items
const getItems = (req, res, next) => {
  Items.find({})
    .orFail()
    // Return found items
    .then((items) => res.status(200).send({ data: items }))
    .catch((err) => {
      // No items found
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('No items found'));
      }
      // Other errors
      return next(err);
    });
};

// create a new clothing item
const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  Items.create({
    name,
    weather,
    imageUrl,
    owner,
  })
    // Successful creation returns the created item
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      // invalid data provided
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Error: Invalid data'));
      }
      // Other errors
      return next(err);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  // Find the item to check ownership
  Items.findById(itemId)
    .orFail()
    .then((item) => {
      // Check if the requesting user is the owner
      if (item.owner.toString() !== userId) {
        return next(
          new ForbiddenError('You do not have permission to delete this item'),
        );
      }
      // Proceed to delete the item
      return Items.findByIdAndDelete(itemId)
        .then((deletedItem) => res.status(200).send({ data: deletedItem }))
        .catch((err) => next(err));
    })
    .catch((err) => {
      // Invalid ID format
      if (err.name === 'CastError') {
        return next(new BadRequestError('Invalid Item ID format'));
      }
      // Item not found
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Item not found'));
      }
      // Other errors
      return next(err);
    });
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  Items.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Invalid Item ID: Item not found'));
      }
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Item not found'));
      }
      return next(err);
    });
};

const unlikeItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  Items.findByIdAndUpdate(itemId, { $pull: { likes: userId } }, { new: true })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Invalid Item ID: Item not found'));
      }
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Item not found'));
      }
      return next(err);
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
