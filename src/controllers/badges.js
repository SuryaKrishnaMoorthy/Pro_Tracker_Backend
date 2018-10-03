const moment = require('moment');
const { badgesModel, tasksModel } = require('../models');

async function getAll (req, res, next) {
  try {
    const response = await badgesModel.getAll();
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
