import React from 'react';
import ReactDom from 'react-dom';
import 'components/common/index.scss';
import Root from './routePages/root';
import Nav from 'components/nav';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './index.scss';

ReactDom.render(
  <BrowserRouter>
    <div>
      <Nav />
      <Switch>
        <Route path="/" component={Root} />
      </Switch>
    </div>
  </BrowserRouter>
  , document.getElementById('container')
);
