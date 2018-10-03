const db = require('../db');

function getAll () {
  return db('badges');
};

function addBadges (score) {
  const obj = {
    bronze: 0,
    silver: 0,
    gold: 0,
    platinum: 0,
    opal: 0,
    diamond: 0,
    painite: 0,
    ruby: 0,
    jadeite: 0,
    garnet: 0
  };
  let temp = {};

  if (score >= 50000) {
    if ((score / 50000) >= 1) {
      const quotient = score / 50000;
      score = score - (parseInt(quotient) * 50000);
      for (let i in obj) {
        obj[i] = parseInt(quotient);
      }
    }
  }

  if (score >= 40000) {
    let { garnet, ...temp } = obj;
    for (let i in temp) {
      obj[i] = obj[i] + 1;
    }
    return obj;
  }

  if (score >= 31500) {
    let { garnet, jadeite, ...temp } = obj;
    for (let i in temp) {
      obj[i] = obj[i] + 1;
    }
    return obj;
  }

  if (score >= 26500) {
    let { garnet, jadeite, ruby, ...temp } = obj;
    for (let i in temp) {
      obj[i] = obj[i] + 1;
    }
    return obj;
  }

  if (score >= 21500) {
    let { garnet, jadeite, ruby, painite, ...temp } = obj;
    for (let i in temp) {
      obj[i] = obj[i] + 1;
    }
    return obj;
  }

  if (score >= 16500) {
    let { garnet, jadeite, ruby, painite, diamond, ...temp } = obj;
    for (let i in temp) {
      obj[i] = obj[i] + 1;
    }
    return obj;
  }

  if (score >= 11500) {
    let { garnet, jadeite, ruby, painite, diamond, opal, ...temp } = obj;
    for (let i in temp) {
      obj[i] = obj[i] + 1;
    }
    return obj;
  }

  if (score >= 5000) {
    obj['gold'] = obj['gold'] + 1;
    obj['silver'] = obj['silver'] + 1;
    obj['bronze'] = obj['bronze'] + 1;
    return obj;
  }

  if (score >= 1000) {
    obj['silver'] = obj['silver'] + 1;
    obj['bronze'] = obj['bronze'] + 1;
    return obj;
  }

  if (score >= 100) {
    obj['bronze'] = obj['bronze'] + 1;
    return obj;
  }
  return obj;
}

function createBadgesForUser (userId) {
  return db('badges')
    .insert({ user_id: userId })
    .returning('*')
    .then(([response]) => response);
}

function incrementScore (userId) {
  return db('badges')
    .update({ score: db.raw('score + 100') })
    .where('user_id', userId)
    .returning('*')
    .then(([response]) => console.log(response));
};

function decrementScore (userId) {
  return db('badges')
    .update({ score: db.raw('score - 100') })
    .where('user_id', userId)
    .returning('*')
    .then(([response]) => console.log(response));
};

module.exports = {
  getAll,
  incrementScore,
  decrementScore,
  createBadgesForUser,
  addBadges
};
