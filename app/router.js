

module.exports = (app) => {
  const { router, controller } = app;
  router.resources('/api/fund/transaction', controller.transaction);
  router.resources('/api/fund/market', controller.market);
  router.get('/api/*', controller.home.api);
  router.resources('/*', controller.home);
};
