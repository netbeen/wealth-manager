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

  async show() {
    const { ctx } = this;
    ctx.body = await ctx.model.User.findById(toInt(ctx.params.id));
  }

  async create() {
    const { ctx } = this;
    const { nickname, uuid } = ctx.request.body;
    const user = await ctx.model.User.create({ nickname, uuid });
    ctx.status = 201;
    ctx.body = user;
  }

  // async update() {
  //   const ctx = this.ctx;
  //   const id = toInt(ctx.params.id);
  //   const user = await ctx.model.User.findById(id);
  //   if (!user) {
  //     ctx.status = 404;
  //     return;
  //   }
  //
  //   const { name, age } = ctx.request.body;
  //   await user.update({ name, age });
  //   ctx.body = user;
  // }
  //
  // async destroy() {
  //   const ctx = this.ctx;
  //   const id = toInt(ctx.params.id);
  //   const user = await ctx.model.User.findById(id);
  //   if (!user) {
  //     ctx.status = 404;
  //     return;
  //   }
  //
  //   await user.destroy();
  //   ctx.status = 200;
  // }
}

module.exports = LoginController;
