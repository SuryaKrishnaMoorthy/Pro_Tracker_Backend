const express = require('express');
const router = express.Router({ mergeParams: true });
const { statusController } = require('../controllers');
const auth = require('../lib/auth');

router.get('/', auth.isLoggedIn, statusController.getAll);
router.get('/:id', auth.isLoggedIn, statusController.getStatusOfATask);
router.post('/', auth.isAuthorized, statusController.create);
router.delete('/:id/:statusId', auth.isAuthorized, statusController.destroy);

module.exports = router;
