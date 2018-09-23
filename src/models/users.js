const { promisify } = require('util');
const bcrypt = require('bcryptjs');
const db = require('../db');

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

module.exports = { create, login };
