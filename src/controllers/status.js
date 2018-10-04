const moment = require('moment');
const { statusModel, tasksModel } = require('../models');
const badgesController = require('./badges');

async function getAll (req, res, next) {
  try {
    const response = await statusModel.getAll();
    response.forEach((status) => {
      status.task_date = moment(status.task_date).format('YYYY-MM-DD');
    });
    res.status(200).json({ all_task_status: response });
  } catch (e) {
    next({
      status: 400,
      error: `Task status could not be found`
    });
  };
};

async function getStatusOfATask (req, res, next) {
  try {
    const response = await statusModel.getStatusOfATask(req.params.id);
    response.forEach((status) => {
      status.task_date = moment(status.task_date).format('YYYY-MM-DD');
    });
    res.status(200).json({ task_status: response });
  } catch (e) {
    next({
      status: 400,
      error: `Task status could not be found`
    });
  };
};

async function create (req, res, next) {
  try {
    if (req.body.task_date) {
      const response = await statusModel.create({ ...req.body });
      await tasksModel.updateScore(req.body.task_id, 'add');
      await badgesController.updateBadges(req.taskInDb.user_id, 'add');
      response.task_date = moment(response.task_date).format('YYYY-MM-DD');
      res.status(201).json({ task_status: response });
    } else {
      res.status(400).json({ error: `Status could not be updated. Date is mandatory` });
    }
  } catch (e) {
    next({
      status: 400,
      error: `Task status could not be created. Invalid/Missing request parameters.`
    });
  };
};

async function destroy (req, res, next) {
  await statusModel.destroy({ id: req.params.id, statusId: req.params.statusId });
  await tasksModel.updateScore(req.taskInDb.id, 'minus');
  await badgesController.updateBadges(req.taskInDb.user_id, 'minus');
  res.status(204).json('Status deleted');
};

module.exports = {
  getAll,
  getStatusOfATask,
  create,
  destroy
};
