'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  return app.model.define('user', {
    id: {type: INTEGER, primaryKey: true, autoIncrement: true},
    nickname: STRING(256),
    uuid: STRING(256),
    created_at: DATE,
    updated_at: DATE,
  });
};
