// app/controller/user.js
const { Controller } = require('egg');

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class FundTransactionController extends Controller {
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
    const {
      identifier, date, value, handingFee,
    } = ctx.request.body;
    const fundInfo = await ctx.model.Fund.findOne({
      where: {
        identifier,
      },
    });
    if (!fundInfo) {
      ctx.status = 201;
      ctx.body = {
        code: 400,
        message: '基金信息不存在',
        result: null,
      };
      return;
    }
    const newFundTransaction = await ctx.model.FundTransaction.create({
      fundId: fundInfo.id,
      date: new Date(date),
      value,
      handlingFee: handingFee,
      isValid: true,
      userId: ctx.locals.user.id,
    });
    ctx.status = 201;
    ctx.body = {
      code: 200,
      message: '',
      result: newFundTransaction,
    };
  }
}

module.exports = FundTransactionController;
