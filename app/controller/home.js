'use strict';

const Controller = require('egg').Controller;
class HomeController extends Controller {
  * create() {
    yield this.ctx.render("index.html");
  }
}

module.exports = HomeController;
