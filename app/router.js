'use strict';

module.exports = app => {
  app.get('/api/*', app.controller.home.api);
  app.get('/*', app.controller.home.create);
};
