import * as actions from '../actions/index';

// 页面初始化数据
const initialState = {
  breadcrumb: [],
};
const defaultAction = {
  type: 'doNothing',
};

export default function index(state = initialState, action = defaultAction) {
  switch (action.type) {
    case actions.RECEIVE_BREADCRUMB:
      return { ...state, breadcrumb: action.data };
    default:
      return state;
  }
}
