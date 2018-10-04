const { badgesModel } = require('../models');
const helperBadge = require('../helpers/badges');

async function getAll (req, res, next) {
  try {
    const userId = req.taskInDb.user_id;
    const response = await badgesModel.getAll(userId);
    res.status(200).json({ badges_of_user: response });
  } catch (e) {
    next({
      status: 400,
      error: `Badges could not be found`
    });
  };
};

async function updateBadges (userId, operation) {
  try {
    const response = await badgesModel.getScore(userId);
    if (operation === 'add') {
      const badges = helperBadge.newBadgeValue(response.score + 100);
      await badgesModel.incrementScore(userId, badges);
    } else if (operation === 'minus') {
      const badges = helperBadge.newBadgeValue(response.score - 100);
      await badgesModel.decrementScore(userId, badges);
    }
  } catch (e) {
    console.log(e);
  };
}

module.exports = {
  getAll,
  updateBadges
};
