import React from 'react';
import ReactDom from 'react-dom';
import 'components/common/index.scss';
import Root from './routePages/root';
import Login from './routePages/login';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './index.scss';

ReactDom.render(
  <BrowserRouter>
    <div>
      <Switch>
        <Route exact path="/" component={Root} />
        <Route exact path="/wealth" component={Root} />
        <Route exact path="/login" component={Login} />
      </Switch>
    </div>
  </BrowserRouter>
  , document.getElementById('container')
);
