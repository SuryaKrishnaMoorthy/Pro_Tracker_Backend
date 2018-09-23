const { plural } = require('pluralize');
const { tasksModel, statusModel } = require('../models');

const resourceName = 'task';

async function getTasks (req, res, next) {
  if (req.query.date) {
    getCurrentTasks(req, res, next);
  } else if (req.query.type) {
    getFiltered(req, res, next);
  } else {
    getAllTasks(req, res, next);
  }
}

async function getAllTasks (req, res, next) {
  const userId = req.userId;
  const response = await tasksModel.getAllTasks(userId);
  res.json({ [ plural(resourceName) ]: response });
}

async function getCurrentTasks (req, res, next) {
  const userId = req.userId;
  const response = await tasksModel.getCurrentTasks(userId, req.query.date);
  res.json({ [ plural(resourceName) ]: response });
};

async function getFiltered (req, res, next) {
  const userId = req.userId;
  const response = await tasksModel.getFiltered(userId, req.query.type);
  res.json({ [ plural(resourceName) ]: response });
}

async function getOne (req, res, next) {
  const task = await req.taskInDb;
  const response = await statusModel.getStatusOfATask(task.id);
  task.taskStatus = response;
  res.json({ [resourceName]: task });
};

async function create (req, res, next) {
  try {
    const userId = req.userId;
    const response = await tasksModel.create({ user_id: userId, ...req.body });
    res.status(201).json({ [resourceName]: response });
  } catch (e) {
    next({
      status: 400,
      error: `Task could not be created`
    });
  };
};

async function update (req, res, next) {
  try {
    const response = await tasksModel.update(req.taskInDb.user_id, req.taskInDb.id, req.body);
    res.status(200).json({ [resourceName]: response });
  } catch (e) {
    console.log(e);
    next({
      status: 400,
      error: `Task could not be updated`
    });
  };
};

async function destroy (req, res, next) {
  try {
    const id = req.params.id;
    await tasksModel.destroy(id);
    res.status(204).json('Task Deleted');
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  getTasks,
  getOne,
  create,
  update,
  destroy
};
