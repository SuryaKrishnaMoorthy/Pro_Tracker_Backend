const db = require('../db');

function getAll (userId) {
  return db('badges')
    .where({ user_id: userId })
    .then(([response]) => response);
};

function createBadgesForUser (userId) {
  return db('badges')
    .insert({ user_id: userId })
    .returning('*')
    .then(([response]) => response);
}

function getScore (userId) {
  return db('badges')
    .where({ user_id: userId })
    .then(([response]) => response);
}

function incrementScore (userId, badges) {
  return db('badges')
    .update({
      score: db.raw('score + 100'),
      ...badges
    })
    .where('user_id', userId)
    .returning('*')
    .then(([response]) => response);
};

function decrementScore (userId, badges) {
  return db('badges')
    .update({
      score: db.raw('score - 100'),
      ...badges
    })
    .where('user_id', userId)
    .returning('*')
    .then(([response]) => response);
};

module.exports = {
  getAll,
  incrementScore,
  decrementScore,
  createBadgesForUser,
  getScore
};
