const express = require('express');
const router = express.Router({ mergeParams: true });
const { userController } = require('../controllers');

router.post('/signup', userController.signup);
router.post('/login', userController.login);

module.exports = router;
