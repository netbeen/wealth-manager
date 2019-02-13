import React from 'react';
import ReactDom from 'react-dom';

import { Provider } from 'react-redux';
import { combineReducers } from 'redux';
import createStore from './store/index';
import reducers from './reducers/index';

import 'components/common/index.scss';
import Wealth from './routePages/wealth';
import Login from './routePages/login';
import WealthRecordDetail from './routePages/wealthRecordDetail';
import WealthRecordList from './routePages/wealthRecordList';
import Index from './routePages/index';
import Error404 from './routePages/error404';
import FundDashboard from './routePages/fundDashboard';
import FundDetail from './routePages/fundDetail';
import FundPurchase from './routePages/fundPurchase';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './index.scss';

const store = createStore(combineReducers({ index: reducers }));

ReactDom.render(
  <Provider store={store}>
    <BrowserRouter>
      <div>
        <Switch>
          <Route exact path="/" component={Index} />
          <Route exact path="/wealth" component={Wealth} />
          <Route exact path="/wealth/record" component={WealthRecordList} />
          <Route exact path="/wealth/record/create" component={WealthRecordDetail} />
          <Route exact path="/wealth/record/:recordId" component={WealthRecordDetail} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/fund" component={FundDashboard} />
          <Route exact path="/fund/purchase" component={FundPurchase} />
          <Route exact path="/fund/:identifier" component={FundDetail} />
          <Route component={Error404} />
        </Switch>
      </div>
    </BrowserRouter>
  </Provider>
  , document.getElementById('container')
);
