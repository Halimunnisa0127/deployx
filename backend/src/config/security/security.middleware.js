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
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
    })
  );
};

module.exports = securityMiddleware;