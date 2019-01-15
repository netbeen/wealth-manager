import React from 'react';
import ReactDom from 'react-dom';
import 'components/common/index.scss';
import Root from './containers/root';
import './index.scss';

ReactDom.render(<Root />, document.getElementById('container'));
