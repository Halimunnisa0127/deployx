const generateSlug = (text, keepCase = false) => {
  let slug = text.toString();
  
  if (!keepCase) {
    slug = slug.toLowerCase();
  }

  return slug
    .normalize('NFD') // Normalize to NFD Unicode form
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-zA-Z0-9 -]/g, '') // Remove invalid chars
    .replace(/\s+/g, '-') // Collapse whitespace and replace by -
    .replace(/-+/g, '-') // Collapse dashes
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

const generateUniqueSlug = (text, suffixLength = 6) => {
  const baseSlug = generateSlug(text);
  const crypto = require('crypto');
  const randomSuffix = crypto.randomBytes(suffixLength / 2).toString('hex');
  return `${baseSlug}-${randomSuffix}`;
};

module.exports = {
  generateSlug,
  generateUniqueSlug,
};
