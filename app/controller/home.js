

const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    await this.ctx.render('index.html', {
      user: this.ctx.locals.user,
    });
  }

  async api() {
    this.ctx.body = { code: 200 };
  }
}

module.exports = HomeController;
