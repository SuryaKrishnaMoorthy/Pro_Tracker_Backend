const { promisify } = require('util');
const bcrypt = require('bcryptjs');
const db = require('../db');

async function getUser (id) {
  return db('users')
    .where({ id })
    .returning('*')
    .then(([response]) => response);
};

async function create ({ password, ...body }) {
  const hashed = await promisify(bcrypt.hash)(password, 8);
  return db('users')
    .insert({ ...body, password: hashed })
    .returning('*')
    .then(([response]) => response);
};

function login ({ email, password }) {
  return db('users')
    .where({ email })
    .then(async ([ user ]) => {
      if (!user) throw new Error();
      const isValid = await promisify(bcrypt.compare)(password, user.password);
      if (!isValid) throw new Error();
      return user;
    });
};

function deleteUser (id) {
  return db('users')
    .where({ id })
    .del()
    .returning('*')
    .then(([response]) => response);
};

module.exports = { create, login, getUser, deleteUser };
