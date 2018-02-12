

const { Controller } = require('egg');

class FundTransactionController extends Controller {
  async index() {
    console.log('this.app.mysql', await this.app.mysql.select('users', {
      // where: { status: 'draft' },
      // orders: [['created_at','desc'], ['id','desc']],
      // limit: 10,
      // offset: 0
    }));
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

