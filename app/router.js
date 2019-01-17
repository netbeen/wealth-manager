

module.exports = (app) => {
  const { router, controller } = app;
  router.resources('/api/v1/fund/transaction', controller.transaction);
  router.resources('/api/v1/fund/market', controller.market);
  router.get('/api/*', controller.home.api);
  router.resources('/users', '/users', controller.users);
  router.resources('/wealthCategory', '/wealthCategory', controller.wealthCategory);
  router.resources('/wealthRecord', '/wealthRecord', controller.wealthRecord);
  router.get('/login/compete', controller.loginCompete.index);
  router.get('/login/logout', controller.loginCompete.logout);
  router.get('*', controller.home.index);
};
