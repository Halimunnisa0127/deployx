const asyncHandler = require('./helpers/asyncHandler');
const { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken, decodeToken } = require('./helpers/jwt.helper');
const { hashPassword, comparePassword } = require('./helpers/password.helper');
const { setRefreshTokenCookie, clearRefreshTokenCookie } = require('./helpers/cookie.helper');
const QueryBuilder = require('./helpers/QueryBuilder');
const { isValidObjectId } = require('./helpers/objectId.helper');
const StringHelper = require('./helpers/string.helper');
const TimeHelper = require('./helpers/time.helper');
const { generateSlug, generateUniqueSlug } = require('./generators/slug.generator');
const IdGenerator = require('./generators/id.generator');

module.exports = {
  asyncHandler,
  jwtHelper: { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken, decodeToken },
  passwordHelper: { hashPassword, comparePassword },
  cookieHelper: { setRefreshTokenCookie, clearRefreshTokenCookie },
  QueryBuilder,
  isValidObjectId,
  StringHelper,
  TimeHelper,
  generateSlug,
  generateUniqueSlug,
  IdGenerator,
};
