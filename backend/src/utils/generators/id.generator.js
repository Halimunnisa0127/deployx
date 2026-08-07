const crypto = require('crypto');

const generateId = (prefix, length = 16) => {
  const randomStr = crypto.randomBytes(length / 2).toString('hex');
  return prefix ? `${prefix}_${randomStr}` : randomStr;
};

const IdGenerator = {
  deployment: () => generateId('dpl', 16),
  build: () => generateId('bld', 16),
  invitation: () => generateId('inv', 24),
  apiKey: () => generateId('dx', 32),
  custom: (prefix, length) => generateId(prefix, length),
};

module.exports = IdGenerator;
