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
    ctx.body = await Promise.all(
      wealthRecords.map(async wealthRecord => ({
        ...wealthRecord.dataValues,
        wealthRecordItems: await ctx.model.WealthRecordItem.findAll({
          where: {
            recordId: wealthRecord.dataValues.id,
          },
        }),
      })),
    );
  }

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

  async update() {
    const { ctx } = this;
    const recordId = parseInt(ctx.params.id, 10);
    const { date, recordItemList } = ctx.request.body;

    const targetRecord = await ctx.model.WealthRecord.findOne({
      where: {
        id: recordId,
      },
    });
    const targetRecordItems = await ctx.model.WealthRecordItem.findAll({
      where: {
        recordId,
      },
    });
    targetRecordItems.forEach(async (targetRecordItem) => {
      await targetRecordItem.destroy();
    });
    recordItemList.forEach(async (recordItem) => {
      await ctx.model.WealthRecordItem.create({
        recordId,
        categoryId: parseInt(recordItem.category.id, 10),
        value: parseFloat(recordItem.value),
      });
    });
    await targetRecord.update({ date: new Date(date) });
    ctx.body = '1111';
  }

  async destroy() {
    const { ctx } = this;
    const recordId = parseInt(ctx.params.id, 10);

    const targetRecordItems = await ctx.model.WealthRecordItem.findAll({
      where: {
        recordId,
      },
    });
    targetRecordItems.forEach(async (targetRecordItem) => {
      await targetRecordItem.destroy();
    });
    const targetRecord = await ctx.model.WealthRecord.findOne({
      where: {
        id: recordId,
      },
    });
    await targetRecord.destroy();
    ctx.body = '1111';
  }
}

module.exports = WealthRecord;
