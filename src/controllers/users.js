const { userModel } = require('../models');
const auth = require('../lib/auth');

/* Function for user registration */
async function signup (req, res, next) {
  try {
    const response = await userModel.create(req.body);
    const token = auth.createToken(response.id);
    res.status(201).json({ token });
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

module.exports = { signup, login };
