module.exports = {
  // 在执行数据库升级时调用的函数，创建 users 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('wealthCategories', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true }, // 类目ID
      name: STRING(256), // 类目名称
      parentId: INTEGER, // 父类目ID，-1为根类目
      type: STRING(256), // 类目类型，asset or debt
      created_at: DATE,
      updated_at: DATE,
    });
  },
  // 在执行数据库降级时调用的函数，删除 users 表
  down: async (queryInterface) => {
    await queryInterface.dropTable('wealthCategories');
  },
};
