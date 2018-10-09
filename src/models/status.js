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

function getStatus (ids) {
  return db('status')
    .where(function () {
      this
        .whereIn('task_id', ids);
    });
};

function create (body) {
  return db('status')
    .insert(body)
    .returning('*')
    .then(([response]) => response);
};

function destroy ({ id, statusId }) {
  return db('status')
    .where(function () {
      this
        .where('id', statusId)
        .andWhere('task_id', id);
    })
    .del()
    .returning('*')
    .then(([response]) => response);
};

function filteredDestroy (id, dates) {
  return db('status')
    .where(function () {
      this
        .whereNotIn('task_date', dates)
        .andWhere('task_id', id);
    })
    .del()
    .returning('*')
    .then(([response]) => response);
};

module.exports = {
  getAll,
  getStatusOfATask,
  getFiltered,
  get,
  getStatus,
  create,
  destroy,
  filteredDestroy
};
