// app/service/fund.js
const { Service } = require('egg');
const request = require('async-request');


class FundService extends Service {
  async fetchByIdentifier(fundIdentifier) {
    try {
      const response = await request(`https://fund.10jqka.com.cn/data/client/myfund/${fundIdentifier}`);
      return JSON.parse(response.body).data[0];
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async fetchNetValueByIdentifier(fundIdentifier) {
    try {
      const response = await request(`https://fund.10jqka.com.cn/${fundIdentifier}/json/jsondwjz.json`);
      return response.body.split('=')[1];
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}

module.exports = FundService;
