const { statusModel } = require('../models');

async function getAll (req, res, next) {
  try {
    const response = await statusModel.getAll();
    res.status(201).json({ all_task_status: response });
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
    res.status(201).json({ task_status: response });
  } catch (e) {
    next({
      status: 400,
      error: `Task status could not be found`
    });
  };
};

async function create (req, res, next) {
  try {
    const response = await statusModel.create({ ...req.body });
    res.status(201).json({ task_status: response });
  } catch (e) {
    next({
      status: 400,
      error: `Task status could not be created`
    });
  };
};

async function destroy (req, res, next) {
  await statusModel.destroy({ id: req.params.id, statusId: req.params.statusId });
  res.status(204).json('Status deleted');
};

module.exports = {
  getAll,
  getStatusOfATask,
  create,
  destroy
};
