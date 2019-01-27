import * as actions from '../actions/index';

// 页面初始化数据
const initialState = {
  wealthRecordArray: [],
};
const defaultAction = {
  type: 'doNothing',
};

export default function index(state = initialState, action = defaultAction) {
  switch (action.type) {
    case actions.SET_WEALTH_RECORD_ARRAY:
      return { ...state, wealthRecordArray: action.data };
    default:
      return state;
  }
}
