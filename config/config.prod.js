const secretConfig = require('./secretConfig');

module.exports = () => {
  const config = exports = {};

  config.sequelize = secretConfig

  config.security = {
    hsts: {
      enable: true,
    },
    csrf: {
      enable: false, // 暂时关闭csrf
      ignoreJSON: true, // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
    },
  };

  return config;
};
