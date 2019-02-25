module.exports = (app) => {
  const {
    DECIMAL, INTEGER, DATE, DOUBLE,
  } = app.Sequelize;

  return app.model.define('fundTransaction', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true }, // ID
    fundId: {
      type: INTEGER,
      field: 'fund_id',
      allowNull: false,
    }, // 基金ID，外键
    date: {
      type: DATE,
      allowNull: false,
    }, // 交易日期
    value: {
      type: DOUBLE,
      allowNull: false,
    }, // 交易份数
    handlingFee: {
      field: 'handling_fee',
      type: DECIMAL(10, 2),
      allowNull: false,
    }, // 交易手续费
    redemptionDate: {
      field: 'redemption_date',
      type: DATE,
      allowNull: true,
    }, // 是否已被卖出
    userId: {
      field: 'user_id',
      type: INTEGER,
      allowNull: false,
    }, // 用户ID，外键
    created_at: DATE,
    updated_at: DATE,
  });
};
