const { SECRET_KEY } = process.env;
const { sign, verify } = require('jsonwebtoken');
const db = require('../db');

/* Function to create token for the user */
function createToken (id) {
  const sub = { sub: { id } };
  const options = { expiresIn: '10 days' };
  return sign(sub, SECRET_KEY, options);
};

/* Function to validate the token */
function parseToken (authorization) {
  const token = authorization && authorization.split('Bearer ')[1];
  return verify(token, SECRET_KEY);
};

/* Function to verify user's session */
function isLoggedIn (req, res, next) {
  try {
    const token = parseToken(req.headers.authorization);
    const userId = token.sub.id;
    req.userId = userId;
    next();
  } catch (e) {
    console.log('ERROR', e);
    next({
      status: 401,
      error: `Session has expired. Please login again.`
    });
  };
};

/* Function for user authorization */
async function isAuthorized (req, res, next) {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      const message = `You are not authorized to access this route`;
      return next({ status: 401, error: message });
    }

    const token = parseToken(authorization);
    const userId = token.sub.id;

    const taskId = req.params.id || req.body.task_id;
    const task = await db('tasks').where({ id: taskId }).first();

    if (!task) {
      return next({ status: 404, error: `Task could not be found` });
    }
    if (task.user_id !== userId) {
      const message = `You are not authorized to view this task`;
      return next({ status: 401, error: message });
    }
    req.taskInDb = task;
    next();
  } catch (e) {
    console.log(e);
    next({
      status: 401,
      error: `Session has expired. Please login again.`
    });
  };
};

module.exports = {
  createToken,
  parseToken,
  isLoggedIn,
  isAuthorized
};
