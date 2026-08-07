const mongoose = require('mongoose');

/**
 * Validates if a given string is a valid MongoDB ObjectId
 * @param {string} id - The string to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidObjectId = (id) => {
  if (!id) return false;
  return mongoose.Types.ObjectId.isValid(id) && (String(new mongoose.Types.ObjectId(id)) === String(id));
};

module.exports = {
  isValidObjectId,
};
