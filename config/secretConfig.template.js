module.exports = {
  sequelize: {
    dialect: 'mysql',
    host: 'PLACEHOLDER_MYSQL_HOST',
    // eslint-disable-next-line no-undef
    port: PLACEHOLDER_MYSQL_PORT,
    username: 'PLACEHOLDER_MYSQL_USERNAME',
    password: 'PLACEHOLDER_MYSQL_PASSWORD',
    database: 'wealthManager',
    timezone: '+08:00', // 东八时区
    pool: {
      max: 2, // 最大值
      min: 0, // 最小值
      acquire: 30000, //
      idle: 10000, // 闲时超时
    },
  },
  app: {
    key: 'wealth-manager-key',
  },
};
