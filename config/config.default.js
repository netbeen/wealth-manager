// const secretConfig = require('./secretConfig');

module.exports = () => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = 'wealth-manager-key';

  // add your config here
  config.middleware = ['getUser'];

  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.html': 'nunjucks',
    },
  };

  config.sequelize = {
    dialect: 'mysql',
    host: '47.88.175.208',
    port: 3306,
    username: 'yangyang',
    password: 'yangyang',
    database: 'wealthManager',
    timezone: '+08:00', // 东八时区
  };

  config.security = {
    csrf: {
      enable: false, // 暂时关闭csrf
      ignoreJSON: true, // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
    },
  };

  return config;
};
