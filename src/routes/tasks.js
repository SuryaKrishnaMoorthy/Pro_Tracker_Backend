const express = require('express');
const router = express.Router({ mergeParams: true });
const { tasksController } = require('../controllers');
const auth = require('../lib/auth');

// ?date=''
// router.get('/', auth.isLoggedIn, tasksController.getCurrentTasks);
router.get('/', auth.isLoggedIn, tasksController.getAllTasks);
// router.get('/:id', auth.isAuthorized, tasksController.getOne);
router.get('/:type', auth.isLoggedIn, tasksController.getFiltered);

router.post('/', auth.isLoggedIn, tasksController.create);
router.put('/:id', auth.isAuthorized, tasksController.update);
router.delete('/:id', auth.isAuthorized, tasksController.destroy);

module.exports = router;
