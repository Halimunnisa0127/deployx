const crypto = require('crypto');

const requestContext = (req, res, next) => {
  req.requestId = crypto.randomUUID();
  req.requestStartTime = Date.now();
  req.ipAddress = req.ip || req.connection.remoteAddress;
  req.userAgent = req.get('User-Agent') || '';
  
  res.setHeader('X-Request-Id', req.requestId);
  
  next();
};

module.exports = requestContext;
