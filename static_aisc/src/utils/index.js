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

export const wealthUtils = {
  SUM_TYPE: {
    NET_ASSET: Symbol('netAsset'),
    TOTAL_ASSET: Symbol('totalAsset'),
  },
  sumAsset: (wealthRecord, wealthCategoryFlatArray, sumType = wealthUtils.SUM_TYPE.TOTAL_ASSET) => {
    if (wealthCategoryFlatArray.length === 0) {
      return 0;
    }
    const result = wealthRecord.wealthRecordItems.reduce((sum, wealthRecordItems) => {
      if (wealthCategoryFlatArray.filter((category) => {
        return category.id === wealthRecordItems.categoryId;
      })[0].type === 'asset') {
        return sum + parseFloat(wealthRecordItems.value);
      } else {
        return sumType === wealthUtils.SUM_TYPE.NET_ASSET
          ? sum - parseFloat(wealthRecordItems.value)
          : sum;
      }
    }, 0);
    return result;
  },
};

/**
 * 将string型的数值转换为千分位分隔型的string
 * @param numString toFixed后的string
 * @returns {*} 千分位分隔型的string
 */
export const toThousands = (numString) => {
  if (!numString) {
    return null;
  }
  const [, sign, integer, decimal] = numString.match(/(-)?(.*)\.(.*)?$/);
  let integerResult = '';
  let integerRemain = integer;

  while (integerRemain.length > 3) {
    integerResult = `,${integerRemain.slice(-3)}${integerResult}`;
    integerRemain = integerRemain.slice(0, integerRemain.length - 3);
  }
  if (integerRemain) { integerResult = integerRemain + integerResult; }
  return `${sign === '-' ? '-' : ''}${integerResult}.${decimal}`;
};

export const NameSpace = tools.namespace.bind(tools);
export default tools;
