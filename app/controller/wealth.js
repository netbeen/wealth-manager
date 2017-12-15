'use strict';

const Controller = require('egg').Controller;
class HomeController extends Controller {
  * index() {
    yield this.ctx.render('wealthIndex.tpl');
  }
}

module.exports = HomeController;
