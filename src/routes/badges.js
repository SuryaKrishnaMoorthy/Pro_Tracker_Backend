const express = require('express');
const router = express.Router({ mergeParams: true });
const { badgesController } = require('../controllers');
const auth = require('../lib/auth');

router.get('/', auth.isLoggedIn, badgesController.getAll);

module.exports = router;
