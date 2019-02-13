module.exports = {
  // 在执行数据库升级时调用的函数，创建 fundTransactions 表
  up: async (queryInterface, Sequelize) => {
    const {
      INTEGER, DATE, DECIMAL, BOOLEAN,
    } = Sequelize;
    await queryInterface.createTable('fundTransactions', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true }, // ID
      fund_id: {
        type: INTEGER,
        allowNull: false,
      }, // 基金ID，外键
      date: {
        type: DATE,
        allowNull: false,
      }, // 交易日期
      value: {
        type: DECIMAL(10, 2),
        allowNull: false,
      }, // 交易金额
      handling_fee: {
        type: DECIMAL(10, 2),
        allowNull: false,
      }, // 交易手续费
      is_valid: {
        type: BOOLEAN,
        allowNull: false,
      }, // 是否已被卖出
      user_id: {
        type: INTEGER,
        allowNull: false,
      }, // 用户ID，外键
      created_at: DATE,
      updated_at: DATE,
    });
    await queryInterface.addIndex(
      'fundTransactions',
      ['fund_id', 'date', 'is_valid', 'user_id'],
    );
  },
  // 在执行数据库降级时调用的函数，删除 fundTransactions 表
  down: async (queryInterface) => {
    await queryInterface.dropTable('fundTransactions');
  },
};
