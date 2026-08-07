const routes = require('./routes/googleAuth.routes');
const services = {
  googleAuthService: require('./services/googleAuth.service'),
};

module.exports = {
  routes,
  services,
};
