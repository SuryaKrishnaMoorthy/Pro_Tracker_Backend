const { userModel, badgesModel } = require('../models');
const auth = require('../lib/auth');

function checkMandatoryParameters (req) {
  return (req.body.email && req.body.password &&
    req.body.first_name && req.body.last_name && req.body.zip_code);
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

module.exports = { signup, login };
