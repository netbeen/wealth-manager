// app/controller/user.js
const { Controller } = require('egg');

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class FundController extends Controller {
  async index() {
    const { ctx } = this;
    const query = { limit: toInt(ctx.query.limit), offset: toInt(ctx.query.offset) };
    ctx.body = {
      code: 200,
      message: '',
      result: await ctx.model.Fund.findAll(query),
    };
  }

  async show() {
    const { ctx } = this;
    const existedFund = await ctx.model.Fund.findOne({
      where: {
        identifier: ctx.params.id,
      },
    });
    if (!existedFund) {
      ctx.body = {
        code: 404,
        message: '',
        result: null,
      };
      return;
    }
    ctx.body = {
      code: 200,
      message: '',
      result: existedFund,
    };
  }

  async create() {
    const { ctx } = this;
    const { identifier } = ctx.request.body;
    const fundInfo = await ctx.service.fund.fetchByIdentifier(identifier);
    const formattedFundInfo = {
      identifier: fundInfo.code,
      name: fundInfo.name,
      type: fundInfo.fundtype,
      accumulatedNetValue: await ctx.service.fund.fetchAccumulatedNetValueByIdentifier(identifier),
      unitNetValue: await ctx.service.fund.fetchUnitNetValueByIdentifier(identifier),
    };
    await ctx.service.fund.saveFundDataToDB(formattedFundInfo);
    ctx.status = 201;
    ctx.body = {
      code: 200,
      message: '',
      result: formattedFundInfo,
    };
  }
}

module.exports = FundController;
