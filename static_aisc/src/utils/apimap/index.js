/**
 * 使用Exceed作为ajax库
 * 文档见 http://web.npm.alibaba-inc.com/package/exceed
 */

import Exceed from 'exceed';
import apimap from './apimap.js';

// 对apimap做一次封装，最简只需定义id和url字段
function apimapCreator(apimapArr) {
  // 在这里可以对请求做一些统一处理，如加前缀、加headers
  return apimapArr.map(option => ({
    name: option.name || option.id,
    id: option.id,
    method: option.method || 'get',
    type: option.type || 'json',
    urls: {
      local: option.url,
    },
  }));
}

const exceed = new Exceed({
  ENV: 'local',
});
exceed.use(apimapCreator(apimap));

export default exceed;
