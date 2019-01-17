module.exports = (app) => {
  const { INTEGER, DATE, DECIMAL } = app.Sequelize;

  const WealthRecordItem = app.model.define('wealthRecordItem', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true }, // ID
    recordId: {
      type: INTEGER,
      field: 'record_id',
      allowNull: false,
    }, // 记录ID
    categoryId: {
      type: INTEGER,
      field: 'category_id',
      allowNull: false,
    }, // 类目ID
    value: DECIMAL(10, 2),
    created_at: DATE,
    updated_at: DATE,
  });

  return WealthRecordItem;
};
