'use strict';

module.exports = app => {
  app.get('/', app.controller.home.create);
  app.get('/wealth', app.controller.wealth.index);
};
