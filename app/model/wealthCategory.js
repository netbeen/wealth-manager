module.exports = (app) => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  return app.model.define('wealthCategory', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true }, // 类目ID
    name: STRING(256), // 类目名称
    parent_id: INTEGER, // 父类目ID，-1为根类目
    type: STRING(256), // 类目类型，asset or debt
    created_at: DATE,
    updated_at: DATE,
  });
};
