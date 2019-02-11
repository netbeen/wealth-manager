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
      netValue: await ctx.service.fund.fetchNetValueByIdentifier(identifier),
    };
    const existedFund = await ctx.model.Fund.findOne({
      where: {
        identifier: formattedFundInfo.identifier,
      },
    });
    if (existedFund) {
      console.log('fund update:', formattedFundInfo);
      await existedFund.update(formattedFundInfo);
    } else {
      console.log('fund insert:', formattedFundInfo);
      await ctx.model.Fund.create(formattedFundInfo);
    }
    ctx.status = 201;
    ctx.body = {
      code: 200,
      message: '',
      result: formattedFundInfo,
    };
  }
}

module.exports = FundController;
