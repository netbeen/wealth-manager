

module.exports = (app) => {
  const { router, controller } = app;
  router.resources('/user', '/user', controller.user);
  router.resources('fundData', '/fundData', controller.fundData);
  router.resources('/wealthCategory', '/wealthCategory', controller.wealthCategory);
  router.resources('/wealthRecord', '/wealthRecord', controller.wealthRecord);
  router.get('/login/compete', controller.loginCompete.index);
  router.get('/login/logout', controller.loginCompete.logout);
  router.get('/sw.js', controller.home.sw);
  router.get('/robots.txt', controller.home.robots);
  router.get('/google7fece503f68ef17f.html', controller.home.googleVerify);
  router.get('/baidu_verify_h1H0l9l1y3.html', controller.home.baiduVerify);
  router.get('/sitemap.xml', controller.home.sitemap);
  router.get('*', controller.home.index);
};
