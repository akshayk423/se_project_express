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
const { validateClothingItem, validateId } = require('../middlewares/validate');
// Create Clothing Item
router.post('/', auth, validateClothingItem, createItem);

// Get all Clothing Items
router.get('/', getItems);

// Like Clothing Item
router.put('/:itemId/likes', auth, validateId, likeItem);

// Unlike Clothing Item
router.delete('/:itemId/likes', auth, validateId, unlikeItem);

// Delete Clothing Item
router.delete('/:itemId', auth, validateId, deleteItem);

module.exports = router;
