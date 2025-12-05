const router = require('express').Router();

// CRUD Operations
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require('../controllers/clothingitem');

// Create Clothing Item
router.post('/', createItem);

// Get all Clothing Items
router.get('/', getItems);

// Like Clothing Item
router.put('/:itemId/likes', likeItem);

// Unlike Clothing Item
router.delete('/:itemId/likes', unlikeItem);

// Delete Clothing Item
router.delete('/:itemId', deleteItem);

module.exports = router;
