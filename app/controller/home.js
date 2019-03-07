

const { Controller } = require('egg');

// import

class HomeController extends Controller {
  async index() {
    await this.ctx.render('index.html', {
      user: this.ctx.locals.user,
      feVersion: '1.10',
    });
  }

  async sw() {
    this.ctx.set('Content-Type', 'text/javascript');
    await this.ctx.render('sw.js');
  }

  async robots() {
    await this.ctx.render('robots.txt');
  }

  async googleVerify() {
    await this.ctx.render('google7fece503f68ef17f.html');
  }

  async baiduVerify() {
    await this.ctx.render('baidu_verify_h1H0l9l1y3.html');
  }

  async sitemap() {
    await this.ctx.render('sitemap.xml');
  }

  async api() {
    this.ctx.body = { code: 200 };
  }
}

module.exports = HomeController;
