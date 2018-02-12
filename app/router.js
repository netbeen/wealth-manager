

module.exports = (app) => {
  const { router, controller } = app;
  router.resources('/api/fundTransaction', controller.fundTransaction);
  router.get('/api/*', controller.home.api);
  router.resources('/*', controller.home);
};
