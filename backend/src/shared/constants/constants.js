const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
};

const COOKIE_NAMES = {
  REFRESH_TOKEN: 'refreshToken',
};

const TOKEN_TYPES = {
  ACCESS: 'access',
  REFRESH: 'refresh',
};

const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  OWNER: 'owner',
  MEMBER: 'member',
};

const HEADER_NAMES = {
  AUTHORIZATION: 'Authorization',
  REQUEST_ID: 'X-Request-Id',
};

const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

const PROVIDER_NAMES = {
  GITHUB: 'github',
  GOOGLE: 'google',
  LOCAL: 'local',
};

const DEPLOYMENT_STATUS = {
  QUEUED: 'queued',
  BUILDING: 'building',
  DEPLOYING: 'deploying',
  READY: 'ready',
  FAILED: 'failed',
  CANCELED: 'canceled',
};

const PROJECT_STATUS = {
  ACTIVE: 'active',
  MAINTENANCE: 'maintenance',
  SUSPENDED: 'suspended',
};

module.exports = {
  ENVIRONMENTS,
  COOKIE_NAMES,
  TOKEN_TYPES,
  ROLES,
  HEADER_NAMES,
  HTTP_STATUS_CODES,
  PROVIDER_NAMES,
  DEPLOYMENT_STATUS,
  PROJECT_STATUS,
};
