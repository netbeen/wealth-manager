// module.exports = (app) => {
//   const { STRING, INTEGER, DATE } = app.Sequelize;
//
//   return app.model.define('wealthRecord', {
//     id: { type: INTEGER, primaryKey: true, autoIncrement: true }, // 类目ID
//     userId:
//     parentId: INTEGER, // 父类目ID，-1为根类目
//     type: STRING(256), // 类目类型，asset or debt
//     created_at: DATE,
//     updated_at: DATE,
//   });
// };
