const TimeHelper = {
  addMinutes: (date, minutes) => {
    return new Date(date.getTime() + minutes * 60000);
  },
  
  addDays: (date, days) => {
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
  },

  isExpired: (expirationDate) => {
    return new Date() > new Date(expirationDate);
  },

  getSecondsUntil: (targetDate) => {
    const diff = new Date(targetDate).getTime() - new Date().getTime();
    return Math.max(0, Math.floor(diff / 1000));
  },

  parseTTL: (ttlString) => {
    const value = parseInt(ttlString.slice(0, -1), 10);
    const unit = ttlString.slice(-1);

    switch (unit) {
      case 's': return value;
      case 'm': return value * 60;
      case 'h': return value * 3600;
      case 'd': return value * 86400;
      default: return value;
    }
  }
};

module.exports = TimeHelper;
