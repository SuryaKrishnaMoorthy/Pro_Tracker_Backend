const { RRule } = require('rrule');
const db = require('../db');
const statusModel = require('./status');

function getAllTasks (userId) {
  return db('tasks')
    .where({ 'user_id': userId })
    .then(response => response);
};

function getCurrentTasks (userId, date) {
  return db('tasks')
    .where(function () {
      this
        .where('user_id', userId)
        .andWhere('start_date', '<=', date)
        .andWhere('end_date', '>=', date);
    })
    .then(tasks => {
      return tasks.filter(task => {
        const rule = RRule.fromString(task.r_rule);
        return rule.all().find(rruleDate => {
          return JSON.stringify(rruleDate).includes(date);
        });
      });
    })
    .then(tasks => {
      const ids = tasks.map(({ id }) => id);
      return statusModel.get(ids, date)
        .then(tasksStatus => {
          return tasks.map(task => {
            const filtered = tasksStatus.filter(taskStatus => taskStatus.task_id === task.id);
            return { ...task, taskStatus: filtered };
          });
        });
    });
};

function getFiltered (userId, type) {
  return db('tasks')
    .where(function () {
      this
        .where('user_id', userId)
        .andWhere('task_type', type);
    })
    .then(tasks => {
      const ids = tasks.map(({ id }) => id);
      return statusModel.getFiltered(ids)
        .then(tasksStatus => {
          return tasks.map(task => {
            const filtered = tasksStatus.filter(taskStatus => taskStatus.task_id === task.id);
            return { ...task, taskStatus: filtered };
          });
        });
    })
    .then(response => response);
};

function create (body) {
  return db('tasks')
    .insert(body)
    .returning('*')
    .then(([response]) => response);
};

function find (userId, id) {
  return db('tasks')
    .where({ user_id: userId, id });
}

function update (userId, id, body) {
  return find(userId, id)
    .then(([response]) => {
      return db('tasks')
        .update(({
          ...response,
          ...body,
          updated_at: new Date()
        }))
        .where({ user_id: userId, id })
        .returning('*')
        .then(([response]) => {
          return response;
        });
    });
};

function updateScore (id, updateAction) {
  if (updateAction === 'add') {
    return db('tasks')
      .where(function () {
        this
          .where({ id })
          .andWhere('current_score', '<', db.raw('total_score'));
      })
      .update(({
        'updated_at': new Date(),
        current_score: db.raw('current_score + 100')
      }))
      .returning('*')
      .then(([response]) => {
        return response;
      });
  } else if (updateAction === 'minus') {
    return db('tasks')
      .where(function () {
        this
          .where({ id })
          .andWhere('current_score', '>', 0);
      })
      .update(({
        current_score: db.raw('current_score - 100'),
        updated_at: new Date()
      }))
      .returning('*')
      .then(([response]) => {
        return response;
      });
  }
}

function destroy (id) {
  return db('tasks')
    .where({ id })
    .del()
    .returning('*')
    .then(([response]) => response);
};

module.exports = {
  getAllTasks,
  getCurrentTasks,
  getFiltered,
  create,
  update,
  updateScore,
  destroy
};
