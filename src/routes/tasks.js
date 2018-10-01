const express = require('express');
const router = express.Router({ mergeParams: true });
const { tasksController } = require('../controllers');
const auth = require('../lib/auth');

router.get('/', auth.isLoggedIn, tasksController.getTasks);
router.get('/:id', auth.isAuthorized, tasksController.getOne);

router.post('/', auth.isLoggedIn, tasksController.create);
router.patch('/:id', auth.isAuthorized, tasksController.update);
router.delete('/:id', auth.isAuthorized, tasksController.destroy);

module.exports = router;
