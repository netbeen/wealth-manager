const secretConfig = require('./secretConfig');

module.exports = () => {
  const config = exports = {};

  config.sequelize = secretConfig

  return config;
};
