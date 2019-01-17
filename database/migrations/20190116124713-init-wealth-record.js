module.exports = {
  // 在执行数据库升级时调用的函数，创建 users 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE } = Sequelize;
    await queryInterface.createTable('wealthRecords', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true }, // ID
      user_id: {
        type: INTEGER,
        allowNull: false,
      }, // 用户ID
      date: DATE,
      created_at: DATE,
      updated_at: DATE,
    });
  },
  // 在执行数据库降级时调用的函数，删除 wealthRecordItem 表
  down: async (queryInterface) => {
    await queryInterface.dropTable('wealthRecords');
  },
};
