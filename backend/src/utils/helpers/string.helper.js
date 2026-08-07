const StringHelper = {
  capitalize: (str) => {
    if (!str || typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  truncate: (str, length, ending = '...') => {
    if (!str || str.length <= length) return str;
    return str.substring(0, length - ending.length) + ending;
  },

  maskEmail: (email) => {
    if (!email || !email.includes('@')) return email;
    const [name, domain] = email.split('@');
    if (name.length <= 2) return `${name[0]}***@${domain}`;
    return `${name[0]}${'*'.repeat(name.length - 2)}${name[name.length - 1]}@${domain}`;
  },

  removeSpecialChars: (str) => {
    return str.replace(/[^\w\s]/gi, '');
  }
};

module.exports = StringHelper;
