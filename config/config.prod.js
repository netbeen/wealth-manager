// const secretConfig = require('./secretConfig');

module.exports = () => {
  const config = exports = {};

  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'yangyang',
    password: 'yangyang',
    database: 'wealthManager',
    timezone: '+08:00', // 东八时区
  };

  return config;
};
