const { userModel, badgesModel } = require('../models');
const auth = require('../lib/auth');

function checkMandatoryParameters (req) {
  return (req.body.email && req.body.password &&
    req.body.first_name && req.body.last_name && req.body.zip_code);
}

async function getUser (req, res, next) {
  try {
    const response = await userModel.getUser(req.userId);
    const { first_name, last_name } = response;
    res.status(201).json({ first_name, last_name });
  } catch (e) {
    console.log(e);
    next({ status: 404, error: `User could not be found` });
  };
}

/* Function for user registration */
async function signup (req, res, next) {
  try {
    if (checkMandatoryParameters(req)) {
      const response = await userModel.create(req.body);
      const token = auth.createToken(response.id);
      badgesModel.createBadgesForUser(response.id);
      res.status(201).json({ token });
    } else {
      next({ status: 400, error: `Account could not be created.` });
    }
  } catch (e) {
    console.log(e);
    next({ status: 400, error: `User could not be registered` });
  };
};

/* Function for user authentication */
async function login (req, res, next) {
  try {
    const response = await userModel.login(req.body);
    const token = auth.createToken(response.id);
    res.status(200).json({ token });
  } catch (e) {
    console.log(e);
    next({ status: 401, error: `Email or password is incorrect` });
  };
};

/* Function for user deletion */
async function deleteUser (req, res, next) {
  try {
    const response = await userModel.deleteUser(req.userId);
    res.status(204).json({ response });
  } catch (e) {
    console.log(e);
    next({ status: 401, error: `Could not delete user` });
  };
}

module.exports = { signup, login, getUser, deleteUser };
