import React from 'react';
import ReactDom from 'react-dom';
import 'components/common/index.scss';
import Wealth from './routePages/wealth';
import Login from './routePages/login';
import WealthRecordCreate from './routePages/wealthRecordCreate';
import WealthRecordList from './routePages/wealthRecordList';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './index.scss';

ReactDom.render(
  <BrowserRouter>
    <div>
      <Switch>
        <Route exact path="/" component={Wealth} />
        <Route exact path="/wealth" component={Wealth} />
        <Route exact path="/wealth/record" component={WealthRecordList} />
        <Route exact path="/wealth/record/create" component={WealthRecordCreate} />
        <Route exact path="/login" component={Login} />
      </Switch>
    </div>
  </BrowserRouter>
  , document.getElementById('container')
);
