import exceed from 'utils/apimap';

export const SET_WEALTH_RECORD_ARRAY = 'SET_WEALTH_RECORD_ARRAY';

export const fetchWealthRecordArray = () => {
  return (dispatch) => {
    exceed.fetch({
      api: 'getWealthRecord',
      data: {
        uuid: window.WM_GLOBAL.user.uuid,
      },
    }).then((res) => {
      dispatch({
        type: SET_WEALTH_RECORD_ARRAY,
        data: res,
      });
    }).fail(console.log);;
  };
};
