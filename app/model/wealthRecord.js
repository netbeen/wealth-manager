module.exports = (app) => {
  const { INTEGER, DATE } = app.Sequelize;

  const WealthRecord = app.model.define('wealthRecord', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true }, // ID
    userId: {
      type: INTEGER,
      field: 'user_id',
      allowNull: false,
    }, // 用户ID
    date: DATE,
    created_at: DATE,
    updated_at: DATE,
  });

  return WealthRecord;
};
