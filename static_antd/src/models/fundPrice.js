import { fundTransaction } from '../services/fund';

export default {
  namespace: 'fundPrice',

  state: {
    list: [],
  },

  effects: {
    *getByIdAndStartDate({ payload }, { call, put }) {
      const response = yield call(fundTransaction, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response) ? response : [],
      });
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};
