const bcrypt = require('bcryptjs');

const hashPassword = async (password, saltRounds = 10) => {
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (candidatePassword, hash) => {
  return bcrypt.compare(candidatePassword, hash);
};

module.exports = {
  hashPassword,
  comparePassword,
};
