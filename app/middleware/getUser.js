const loginWhitelist = [
  '/login',
  '/login/compete',
];

module.exports = () => async function login(ctx, next) {
  await next();


  console.log('ctx.originalUrl', ctx.path);
  if (!ctx.cookies.get('uuid') && !loginWhitelist.includes(ctx.path)) {
    ctx.redirect('/login');
  }
};
