module.exports = (app) => {
  const {
    DECIMAL, INTEGER, DATE, BOOLEAN,
  } = app.Sequelize;

  return app.model.define('fund', {
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
      type: DECIMAL(10, 2),
      allowNull: false,
    }, // 交易金额
    handlingFee: {
      field: 'handling_fee',
      type: DECIMAL(10, 2),
      allowNull: false,
    }, // 交易手续费
    isValid: {
      field: 'is_valid',
      type: BOOLEAN,
      allowNull: false,
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
