'use strict';

const Controller = require('egg').Controller;
class HomeController extends Controller {
  * create() {
    yield this.ctx.render("index.html");
  }

  * api() {
    yield this.ctx.body = {code:200};
  }
}

module.exports = HomeController;
