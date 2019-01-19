// app/service/user.js
const { Service } = require('egg');

class UserService extends Service {
  async getByUuid(uuid) {
    return this.ctx.model.User.findOne({
      where: { uuid },
    });
  }
}

module.exports = UserService;
