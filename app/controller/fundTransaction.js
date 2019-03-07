// app/controller/user.js
const { Controller } = require('egg');

class FundTransactionController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = {
      code: 200,
      message: '',
      result: '????',
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

  async getFundByTransaction() {
    const { ctx } = this;
    const existedFundTransactions = await ctx.model.FundTransaction.findAll({
      where: {
        userId: ctx.locals.user.id,
      },
    });
    const fundIds = Array.from(new Set((existedFundTransactions).map(item => item.fundId)));
    const fundInfoArray = await ctx.model.Fund.findAll({
      where: {
        id: fundIds,
      },
    });
    ctx.body = {
      code: 200,
      message: '',
      result: fundInfoArray,
    };
  }

  async getTransactionByFundIdentifier() {
    const { ctx } = this;
    const { identifier } = ctx.params;
    const fundInfo = await ctx.model.Fund.findOne({
      where: {
        identifier,
      },
    });
    const existedFundTransactions = await ctx.model.FundTransaction.findAll({
      where: {
        fundId: fundInfo.id,
        userId: ctx.locals.user.id,
      },
    });
    ctx.body = {
      code: 200,
      message: '',
      result: existedFundTransactions,
    };
  }
}

module.exports = FundTransactionController;
