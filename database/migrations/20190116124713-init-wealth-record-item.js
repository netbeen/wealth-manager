module.exports = {
  // 在执行数据库升级时调用的函数，创建 users 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, DECIMAL } = Sequelize;
    await queryInterface.createTable('wealthRecordItems', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true }, // ID
      record_id: {
        type: INTEGER,
        allowNull: false,
      }, // 记录ID
      category_id: {
        type: INTEGER,
        allowNull: false,
      }, // 类目ID
      value: DECIMAL(10, 2),
      created_at: DATE,
      updated_at: DATE,
    });
  },
  // 在执行数据库降级时调用的函数，删除 wealthRecordItem 表
  down: async (queryInterface) => {
    await queryInterface.dropTable('wealthRecordItems');
  },
};
