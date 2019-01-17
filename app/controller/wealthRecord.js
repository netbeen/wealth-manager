// app/controller/users.js
const { Controller } = require('egg');

class WealthRecord extends Controller {
  async index() {
    const { ctx } = this;
    const wealthRecords = await ctx.model.WealthRecord.findAll({
      where: {
        userId: ctx.locals.user.id,
      },
    });
    const wealthRecordsWithItems = [];
    for (const wealthRecord of wealthRecords) {
      const wealthRecordItems = await ctx.model.WealthRecordItem.findAll({
        where: {
          recordId: wealthRecord.dataValues.id,
        },
      });
      wealthRecordsWithItems.push({
        ...wealthRecord.dataValues,
        wealthRecordItems: wealthRecordItems.map(item => item.dataValues),
      });
    }
    ctx.body = wealthRecordsWithItems;
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

module.exports = WealthRecord;
