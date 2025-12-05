const router = require('express').Router();

// CRUD Operations
const { getUsers, createUser, getUserById } = require('../controllers/user');

// Create User
router.post('/', createUser);
// Get Users
router.get('/', getUsers);
// Get User by ID
router.get('/:userId', getUserById);

module.exports = router;
