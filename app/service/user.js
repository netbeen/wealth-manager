// app/service/user.js
const { Service } = require('egg');

class UserService extends Service {
  async getByUuid(uuid) {
    // const user = await this.ctx.db.query('select * from user where uid = ?', uid);
    const user = await this.ctx.model.User.findOne({
      where: { uuid },
    });
    return user;
  }
}

module.exports = UserService;
