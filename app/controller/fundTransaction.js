

const { Controller } = require('egg');

class FundTransactionController extends Controller {
  async index() {
    this.ctx.body = { code: 1234567 };
  }

  async create() {
    this.ctx.body = { code: 1234567678 };
  }

  async destroy() {
    this.ctx.body = { code: 1234567678 };
  }
}

module.exports = FundTransactionController;

