const helmet = require('helmet');

const securityMiddleware = (app) => {
  app.use(
    helmet({
      crossOriginOpenerPolicy: {
        policy: 'same-origin-allow-popups',
      },

      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
        },
      },
    })
  );
};

module.exports = securityMiddleware;