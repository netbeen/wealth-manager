'use strict';

const Controller = require('egg').Controller;
class HomeController extends Controller {
  * create() {
    yield this.ctx.render('list.tpl');
  }
}

module.exports = HomeController;
