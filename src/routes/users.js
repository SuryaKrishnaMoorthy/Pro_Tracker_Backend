const express = require('express');
const router = express.Router({ mergeParams: true });
const { userController } = require('../controllers');
const auth = require('../lib/auth');

router.get('/', auth.isLoggedIn, userController.getUser);
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.delete('/', auth.isLoggedIn, userController.deleteUser);

module.exports = router;
