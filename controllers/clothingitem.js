const Items = require('../models/clothingitem');
const {
  BAD_REQUEST_CODE,
  DEFAULT_ERROR_CODE,
  NOT_FOUND,
} = require('../utils/error');

// get all clothing items
const getItems = (req, res) => {
  Items.find({})
    .orFail()
    // Return found items
    .then((items) => res.status(200).send({ data: items }))
    .catch((err) => {
      // No items found
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'No items found' });
      }
      // Other errors
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: `${DEFAULT_ERROR_CODE}: Server Error` });
    });
};

// create a new clothing item
const createItem = (req, res) => {
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
        return res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Error: Invalid data' });
      }
      // Other errors
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: `${DEFAULT_ERROR_CODE}: Server Error` });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  Items.findByIdAndDelete(itemId)
    .orFail()
    // Successful deletion returns the deleted document
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      // Invalid ID format
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Invalid Item ID format' });
      }
      // Item not found
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Item not found' });
      }
      // Other errors
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: `${DEFAULT_ERROR_CODE}: Server Error` });
    });
};

const likeItem = (req, res) => {
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
        return res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Invalid Item ID: Item not found' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Item not found' });
      }
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: `${DEFAULT_ERROR_CODE}: Server Error` });
    });
};

const unlikeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  Items.findByIdAndUpdate(itemId, { $pull: { likes: userId } }, { new: true })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Invalid Item ID: Item not found' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Item not found' });
      }
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: `${DEFAULT_ERROR_CODE}: Server Error` });
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
