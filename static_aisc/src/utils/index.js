/**
 * 工具方法
 */

const tools = {
  // 获取url中的参数
  getUrlParam({ name, type }) {
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
    const r = decodeURIComponent(window.location[`${type}`].substr(1)).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  },
  // 获取url中的search参数
  getUrlSearchParam(name) {
    return tools.getUrlParam({ name, type: 'search' });
  },
  // 获取url中的hash参数
  getUrlHashParam(name) {
    return tools.getUrlParam({ name, type: 'hash' });
  },
  // 构造redux action的namespace
  namespace(name) {
    return function (v) {
      return `${name}-${v}`;
    };
  },
};

export const NameSpace = tools.namespace.bind(tools);
export default tools;
