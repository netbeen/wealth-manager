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

export function formatTimeStampToYYYYMMDD(timeStamp) {
  const date = new Date(timeStamp);
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  if (month < 10) {
    month = `0${month}`;
  }
  let day = date.getDate();
  if (day < 10) {
    day = `0${day}`;
  }
  return `${year}-${month}-${day}`;
}

export const datePlus = (inputDate, diff) => {
  const result = new Date(inputDate);
  result.setDate(result.getDate() + diff);
  return result;
};

export const NameSpace = tools.namespace.bind(tools);
export default tools;
