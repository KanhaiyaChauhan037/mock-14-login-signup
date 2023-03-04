const bcrypt = require('bcrypt');

async function hashPassword(password) {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

async function comparePasswords(password, hash) {
  const match = await bcrypt.compare(password, hash);
  return match;
}

module.exports = {
  hashPassword,
  comparePasswords,
};
