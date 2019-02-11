module.exports = (app) => {
  const { STRING, INTEGER, DATE, TEXT } = app.Sequelize;

  return app.model.define('fund', {
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
    accumulatedNetValue: {
      type: TEXT,
      field: 'accumulated_net_value',
      allowNull: false,
    }, // 基金净值
    created_at: DATE,
    updated_at: DATE,
  });
};
