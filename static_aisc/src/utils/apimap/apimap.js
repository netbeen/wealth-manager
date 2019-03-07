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
  }, {
    id: 'postWealthRecord',
    url: '/wealthRecord',
    method: HTTP_METHOD.POST,
  }, {
    id: 'getWealthRecord',
    url: '/wealthRecord',
    method: HTTP_METHOD.GET,
  }, {
    id: 'putWealthRecord',
    url: '/wealthRecord/{{id}}',
    method: HTTP_METHOD.PUT,
  }, {
    id: 'deleteWealthRecord',
    url: '/wealthRecord/{{id}}',
    method: HTTP_METHOD.DELETE,
  }, {
    id: 'getFundData',
    url: '/fundData/{{identifier}}',
    method: HTTP_METHOD.GET,
  }, {
    id: 'getFundTransactionByIdentifier',
    url: '/fund/{{identifier}}/transaction',
    method: HTTP_METHOD.GET,
  }, {
    id: 'getFundByTransaction',
    url: '/fund/getFundByTransaction',
    method: HTTP_METHOD.GET,
  }, {
    id: 'postFundTransaction',
    url: '/fundTransaction',
    method: HTTP_METHOD.POST,
  },
];

export default apimap;
