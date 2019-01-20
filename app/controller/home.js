

const { Controller } = require('egg');

// import

class HomeController extends Controller {
  async index() {
    await this.ctx.render('index.html', {
      user: this.ctx.locals.user,
      feVersion: '1.1',
    });
  }

  async sw() {
    this.ctx.set('Content-Type', 'text/javascript');
    await this.ctx.render('sw.js');
  }

  async api() {
    this.ctx.body = { code: 200 };
  }
}

module.exports = HomeController;
