

module.exports = (app) => {
  const { router, controller } = app;
  router.get('/api/*', controller.home.api);
  router.get('/*', controller.home.create);
};
