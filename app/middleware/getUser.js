const loginWhitelist = [
  '/login',
  '/login/compete',
];

module.exports = () => async function login(ctx, next) {
  const cookieUuid = ctx.cookies.get('uuid');
  if (loginWhitelist.includes(ctx.path)) {
    return next();
  }
  if (!cookieUuid) {
    return ctx.redirect('/login');
  }

  const userInfo = await ctx.service.user.getByUuid(cookieUuid);
  ctx.locals.user = {
    uuid: userInfo.uuid,
    nickname: userInfo.nickname,
    id: userInfo.id,
  };
  return next();
};
