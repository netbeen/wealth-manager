module.exports = {
  // 在执行数据库升级时调用的函数，创建 funds 表
  up: async (queryInterface, Sequelize) => {
    const {
      INTEGER, DATE, STRING, TEXT,
    } = Sequelize;
    await queryInterface.createTable('funds', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true }, // ID
      identifier: {
        type: STRING(256),
        allowNull: false,
      }, // 基金通用代码
      name: {
        type: STRING(256),
        allowNull: false,
      }, // 基金名称
      type: {
        type: STRING(256),
        allowNull: false,
      }, // 基金类型 股票/债券/黄金
      accumulated_net_value: {
        type: TEXT,
        allowNull: false,
      }, // 累计净值, 数组stringify后的结果
      unit_net_value: {
        type: TEXT,
        allowNull: false,
      }, // 单位净值，数组stringify后的结果
      created_at: DATE,
      updated_at: DATE,
    });
    await queryInterface.addIndex(
      'funds',
      ['identifier'],
    );
  },
  // 在执行数据库降级时调用的函数，删除 funds 表
  down: async (queryInterface) => {
    await queryInterface.dropTable('funds');
  },
};
