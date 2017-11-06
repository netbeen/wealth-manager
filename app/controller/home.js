'use strict';

module.exports = app => {
  class HomeController extends app.Controller {
    * index() {
      // this.ctx.body = 'hi, egg';
      yield this.ctx.render('list.tpl', null);

    }
  }
  return HomeController;
};
