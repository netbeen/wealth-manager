

const { Controller } = require('egg');

class FundTransactionController extends Controller {
  async index() {
    this.ctx.body = { code: 1234567 };
  }

  async create() {
    const result = await this.app.mysql.insert('transactions', {
      target_type: 'fund',
      target_id: '160119',
      unit_price: 1.2345,
      total_price: 1000,
      poundage: 2.34,
      is_deleted: false,
      date: new Date('2018-02-02'),
      user_id: 1,
    });
    const insertSuccess = result.affectedRows === 1;
    this.ctx.body = { success: insertSuccess };
  }

  async destroy() {
    this.ctx.body = { code: 1234567678 };
  }
}

module.exports = FundTransactionController;

