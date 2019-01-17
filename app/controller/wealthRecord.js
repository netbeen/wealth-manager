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
    ctx.body = await ctx.model.WealthRecord.findAll(query);
  }

  // async show() {
  //   const { ctx } = this;
  //   ctx.body = await ctx.model.User.findById(toInt(ctx.params.id));
  // }
  //
  async create() {
    const { ctx } = this;
    const { date, recordItemList } = ctx.request.body;
    const wealthRecord = await ctx.model.WealthRecord.create({ userId: ctx.locals.user.id, date });
    recordItemList.forEach(async (recordItem) => {
      await ctx.model.WealthRecordItem.create({
        recordId: wealthRecord.id,
        categoryId: parseInt(recordItem.category.id, 10),
        value: parseFloat(recordItem.value),
      });
    });
    ctx.status = 201;
    ctx.body = wealthRecord;
  }

  // async update() {
  //   const ctx = this.ctx;
  //   const id = toInt(ctx.params.id);
  //   const user = await ctx.model.User.findById(id);
  //   if (!user) {
  //     ctx.status = 404;
  //     return;
  //   }
  //
  //   const { name, age } = ctx.request.body;
  //   await user.update({ name, age });
  //   ctx.body = user;
  // }
  //
  // async destroy() {
  //   const ctx = this.ctx;
  //   const id = toInt(ctx.params.id);
  //   const user = await ctx.model.User.findById(id);
  //   if (!user) {
  //     ctx.status = 404;
  //     return;
  //   }
  //
  //   await user.destroy();
  //   ctx.status = 200;
  // }
}

module.exports = WealthCategoryController;
