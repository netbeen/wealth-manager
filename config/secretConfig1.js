
module.exports = {
  sequelize: {
    dialect: 'mysql',
    host: '192.168.6.2',
    port: 3307,
    username: 'root',
    password: 'yangyang',
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
