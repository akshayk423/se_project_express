const router = require('express').Router();

// CRUD Operations
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require('../controllers/clothingitem');

const auth = require('../middlewares/auth');

// Create Clothing Item
router.post('/', auth, createItem);

// Get all Clothing Items
router.get('/', getItems);

// Like Clothing Item
router.put('/:itemId/likes', auth, likeItem);

// Unlike Clothing Item
router.delete('/:itemId/likes', auth, unlikeItem);

// Delete Clothing Item
router.delete('/:itemId', auth, deleteItem);

module.exports = router;
