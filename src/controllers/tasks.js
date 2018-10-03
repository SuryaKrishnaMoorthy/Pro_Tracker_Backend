const { plural } = require('pluralize');
const moment = require('moment');
const { RRule } = require('rrule');
const { tasksModel, statusModel } = require('../models');

const resourceName = 'task';

function checkMandatoryParameters (req) {
  return (req.body.task_name && req.body.task_type && req.body.status &&
    req.body.start_date && req.body.end_date && req.body.total_score);
}

function checkDateValidity (req) {
  return (!moment(req.body.start_date).isSame(req.body.end_date) &&
        moment(req.body.start_date).isAfter(req.body.end_date));
}

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
  response.forEach((task) => {
    task.start_date = moment(task.start_date).format('YYYY-MM-DD');
    task.end_date = moment(task.end_date).format('YYYY-MM-DD');
  });
  res.json({ [ plural(resourceName) ]: response });
}

async function getCurrentTasks (req, res, next) {
  const userId = req.userId;
  const response = await tasksModel.getCurrentTasks(userId, req.query.date);
  response.forEach((task) => {
    task.start_date = moment(task.start_date).format('YYYY-MM-DD');
    task.end_date = moment(task.end_date).format('YYYY-MM-DD');
  });
  res.json({ [ plural(resourceName) ]: response });
};

async function getFiltered (req, res, next) {
  const userId = req.userId;
  const response = await tasksModel.getFiltered(userId, req.query.type);
  response.forEach((task) => {
    task.start_date = moment(task.start_date).format('YYYY-MM-DD');
    task.end_date = moment(task.end_date).format('YYYY-MM-DD');
  });
  res.json({ [ plural(resourceName) ]: response });
}

async function getOne (req, res, next) {
  const task = await req.taskInDb;
  task.start_date = moment(task.start_date).format('YYYY-MM-DD');
  task.end_date = moment(task.end_date).format('YYYY-MM-DD');
  const response = await statusModel.getStatusOfATask(task.id);
  response.forEach((status) => {
    status.task_date = moment(status.task_date).format('YYYY-MM-DD');
  });
  task.taskStatus = response;
  res.json({ [resourceName]: task });
};

async function create (req, res, next) {
  try {
    const userId = req.userId;
    if (checkMandatoryParameters(req)) {
      if (checkDateValidity(req)) {
        next({
          status: 400,
          error: `Task could not be created. End date should not be less than Start date.`
        });
      } else {
        const response = await tasksModel.create({ user_id: userId, ...req.body });
        response.start_date = moment(response.start_date).format('YYYY-MM-DD');
        response.end_date = moment(response.end_date).format('YYYY-MM-DD');
        res.status(201).json({ [resourceName]: response });
      }
    } else {
      next({
        status: 400,
        error: `Task could not be created. Task Name, Task Type, Task Status, Start Date, End Date and Total Score are mandatory.`
      });
    }
  } catch (e) {
    console.log(e);
    next({
      status: 400,
      error: `Task could not be created. Invalid/Missing request parameters.`
    });
  };
};

async function update (req, res, next) {
  try {
    if (checkMandatoryParameters(req)) {
      if (checkDateValidity(req)) {
        next({
          status: 400,
          error: `Task could not be updated. End date should not be less than Start date.`
        });
      } else {
        const dates = RRule.fromString(req.body.r_rule).all();
        dates.forEach((date) => {
          date = moment(date).format('YYYY-MM-DD');
        });
        const response = await tasksModel.update(req.taskInDb.user_id, req.taskInDb.id, req.body);
        await statusModel.filteredDestroy(req.taskInDb.id, dates);
        response.start_date = moment(response.start_date).format('YYYY-MM-DD');
        response.end_date = moment(response.end_date).format('YYYY-MM-DD');
        res.status(200).json({ [resourceName]: response });
      }
    } else {
      next({
        status: 400,
        error: `Task could not be updated. Task Name, Task Type, Task Status, Start Date, End Date and Total Score are mandatory.`
      });
    }
  } catch (e) {
    console.log(e);
    next({
      status: 400,
      error: `Task could not be updated. Invalid/Missing request parameters.`
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
