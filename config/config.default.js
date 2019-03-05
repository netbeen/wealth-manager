const secretConfig = require('./secretConfig');

module.exports = () => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = secretConfig.app.key;

  // add your config here
  config.middleware = ['recordUrl', 'gzip', 'getUser'];

  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.html': 'nunjucks',
    },
  };

  config.sequelize = secretConfig.sequelize;

  config.security = {
    csrf: {
      enable: false, // 暂时关闭csrf
      ignoreJSON: true, // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
    },
  };

  return config;
};
