import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

const middlewares = [thunkMiddleware];
if (process.env.NODE_ENV === 'development') {
  const loggerMiddleware = createLogger({
    level: 'log',
  });
  middlewares.push(loggerMiddleware);
}

const createStoreWithMdware = applyMiddleware(...middlewares)(createStore);

export default createStoreWithMdware;
