const loginWhitelist = [
  '/',
  '/login',
  '/login/compete',
  '/sw.js',
  '/robots.txt',
  '/google7fece503f68ef17f.html',
  '/baidu_verify_h1H0l9l1y3.html',
  '/sitemap.xml',
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
