// app/controller/users.js
const { Controller } = require('egg');

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class WealthCategoryController extends Controller {
  async index() {
    const { ctx } = this;
    const query = { limit: toInt(ctx.query.limit), offset: toInt(ctx.query.offset) };
    ctx.body = {
      code: 200,
      message: '',
      result: await ctx.model.WealthCategory.findAll(query),
    };
  }
}

module.exports = WealthCategoryController;
