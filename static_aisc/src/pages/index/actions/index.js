import { setLocale } from '@alife/aisc-i18n';
import { NameSpace } from 'utils/index';
import exceed from 'utils/apimap';

const ns = NameSpace('Index');
export const RECEIVE_BREADCRUMB = ns('RECEIVE_BREADCRUMB');

// 获取面包屑数据的action
export function getBreadcrumb() {
  return (dispatch) => {
    exceed
      .fetch({
        api: 'Layout.breadcrumb',
      })
      .then((breadcrumb) => {
        dispatch({
          type: RECEIVE_BREADCRUMB,
          data: breadcrumb.data,
        });
      })
      .fail(console.log);
  };
}

// 切换语言的action
export function changeLang() {
  return (dispatch, getState) => {
    const state = getState();
    const i18n = state.i18n;
    const changeToLang = i18n.locale !== 'zh-cn' ? 'zh-cn' : 'en-us';

    // 设置页面语言
    dispatch(setLocale(changeToLang));
  };
}
