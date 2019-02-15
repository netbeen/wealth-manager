// app/service/user.js
const { Service } = require('egg');

class UserService extends Service {
  /**
   *
   * @param uuid
   * @returns {Promise<*>}
   */
  async getByUuid(uuid) {
    return this.ctx.model.User.findOne({
      where: { uuid },
    });
  }
}

module.exports = UserService;
