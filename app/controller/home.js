

const { Controller } = require('egg');

class HomeController extends Controller {
  async create() {
    await this.ctx.render('index.html');
  }

  async api() {
    this.ctx.body = { code: 200 };
  }
}

module.exports = HomeController;

