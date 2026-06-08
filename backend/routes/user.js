const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, deleteUser } = require('../controllers/user/userController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly); // All user routes are admin-only

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.delete('/:id', deleteUser);

module.exports = router;
