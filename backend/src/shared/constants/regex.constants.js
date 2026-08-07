const REGEX_PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  USERNAME: /^[a-zA-Z0-9_-]{3,20}$/, // alphanumeric, dashes, underscores, 3-20 chars
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/, // lowercase, alphanumeric, hyphen-separated
  DOMAIN: /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i, // Standard domain name
  PASSWORD_STRENGTH: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, // Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
};

module.exports = REGEX_PATTERNS;
