import * as actions from '../actions/index';

// 页面初始化数据
const initialState = {
  wealthRecordArray: [],
  wealthCategoryFlatArray: [],
  wealthCategoryTreeArray: [],
  wealthCategoryOrderArray: [],
};
const defaultAction = {
  type: 'doNothing',
};

export default function index(state = initialState, action = defaultAction) {
  switch (action.type) {
    case actions.SET_WEALTH_RECORD_ARRAY:
      return { ...state, wealthRecordArray: action.data };
    case actions.SET_WEALTH_CATEGORY_FLAT_ARRAY:
      return { ...state, wealthCategoryFlatArray: action.data };
    case actions.SET_WEALTH_CATEGORY_TREE_ARRAY:
      return { ...state, wealthCategoryTreeArray: action.data };
    case actions.SET_WEALTH_CATEGORY_ORDER_ARRAY:
      return { ...state, wealthCategoryOrderArray: action.data };
    default:
      return state;
  }
}
