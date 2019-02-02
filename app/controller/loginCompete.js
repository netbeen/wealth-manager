// app/controller/users.js
const { Controller } = require('egg');

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class LoginController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.cookies.set('uuid', ctx.queries.uuid[0]);
    ctx.redirect('/wealth');
  }

  async logout() {
    const { ctx } = this;
    ctx.cookies.set('uuid', null);
    ctx.redirect('/login');
  }

}

module.exports = LoginController;
