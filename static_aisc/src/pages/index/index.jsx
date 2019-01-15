import React from 'react';
import ReactDom from 'react-dom';
import 'components/common/index.scss';
import Root from './containers/root';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './index.scss';

ReactDom.render(
  <BrowserRouter>
    <div>
      <Switch>
        <Route path="/" component={Root} />
      </Switch>
    </div>
  </BrowserRouter>
  , document.getElementById('container')
);
