const express = require('express');
const cookieParser = require('cookie-parser');

const bodyParserMiddleware = (app) => {
  // JSON parser with raw body capture for GitHub Webhooks
  app.use(
    express.json({
      verify: (req, res, buf) => {
        if (
          req.originalUrl &&
          req.originalUrl.includes('/integrations/github/webhook')
        ) {
          req.rawBody = buf;
        }
      },
    })
  );

  // URL encoded parser
  app.use(
    express.urlencoded({
      extended: true,
    })
  );

  // Cookie parser
  app.use(cookieParser());
};

module.exports = bodyParserMiddleware;