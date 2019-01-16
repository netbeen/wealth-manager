/**
 * api管理文件
 * 可根据模块拆分为多个文件
 */

const HTTP_METHOD = {
  POST: 'POST',
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

const apimap = [
  {
    id: 'getWealthCategory',
    url: '/wealthCategory',
    method: HTTP_METHOD.GET,
  },
];

export default apimap;
