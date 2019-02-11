// app/controller/users.js
const { Controller } = require('egg');

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class UserController extends Controller {
  async index() {
    const { ctx } = this;
    const query = { limit: toInt(ctx.query.limit), offset: toInt(ctx.query.offset) };
    ctx.body = await ctx.model.User.findAll(query);
  }

  async create() {
    const { ctx } = this;
    const { nickname, uuid } = ctx.request.body;
    const user = await ctx.model.User.create({ nickname, uuid });
    ctx.status = 201;
    ctx.body = user;
  }
}

module.exports = UserController;
