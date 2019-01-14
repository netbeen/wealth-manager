import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { combineReducers } from 'redux';
import { loadTranslations, setLocale, syncTranslationWithStore, i18nReducer } from '@alife/aisc-i18n';
import localeData from 'utils/locale.json';
import 'components/common/index.scss';
import createStore from './store/index';
import reducers from './reducers/index';
import Root from './containers/root';
import './index.scss';

const store = createStore(combineReducers({ index: reducers, i18n: i18nReducer }));
syncTranslationWithStore(store);
store.dispatch(loadTranslations(localeData));
// 设置页面语言
store.dispatch(setLocale('zh-cn'));

ReactDom.render(
  <Provider store={store}>
    <Root />
  </Provider>,
  document.getElementById('container')
);
