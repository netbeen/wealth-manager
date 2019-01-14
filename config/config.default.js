const secretConfig = require('./secretConfig');

module.exports = () => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = `${secretConfig.app.key}`;

  // add your config here
  config.middleware = [];

  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.tpl': 'nunjucks',
    },
  };

  // config.mysql = {
  //   client: {
  //     host: secretConfig.mysql.host,
  //     port: secretConfig.mysql.port,
  //     user: secretConfig.mysql.username,
  //     password: secretConfig.mysql.password,
  //     database: 'wealthManager',
  //   },
  // };

  config.sequelize = {
    dialect: 'mysql',
    host: '47.88.175.208',
    port: 3306,
    username: 'yangyang',
    password: 'yangyang',
    database: 'wealthManager',
  };

  config.security = {
    csrf: {
      enable: false, // 暂时关闭csrf
      ignoreJSON: true, // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
    },
  }

  return config;
};

