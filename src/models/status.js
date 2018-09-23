const db = require('../db');

function getAll () {
  return db('status');
};

function getStatusOfATask (taskId) {
  return db('status')
    .where({ task_id: taskId });
};

function getFiltered (ids) {
  return db('status')
    .whereIn('task_id', ids);
};

function get (ids, date) {
  return db('status')
    .where(function () {
      this
        .whereIn('task_id', ids)
        .andWhere('task_date', date);
    });
};

function create (body) {
  return db('status')
    .insert(body)
    .returning('*')
    .then(([response]) => response);
};

function destroy (id) {
  return db('status')
    .where({ id })
    .del()
    .returning('*')
    .then(([response]) => response);
};

module.exports = {
  getAll,
  getStatusOfATask,
  getFiltered,
  get,
  create,
  destroy
};
