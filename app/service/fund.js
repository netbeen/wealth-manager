// app/service/fund.js
const { Service } = require('egg');
const request = require('async-request');

/**
 *
 */
class FundService extends Service {
  /**
   * 保存基金信息
   * @param formattedFundInfo 格式化后的基金信息
   * @returns {Promise<*>}
   */
  async saveFundDataToDB(formattedFundInfo) {
    const existedFund = await this.ctx.model.Fund.findOne({
      where: {
        identifier: formattedFundInfo.identifier,
      },
    });
    let result = null;
    if (existedFund) {
      console.log('fund update:', {
        ...formattedFundInfo,
        accumulatedNetValue: `[${formattedFundInfo.accumulatedNetValue.length}]`,
        unitNetValue: `[${formattedFundInfo.accumulatedNetValue.length}]`,
      });
      result = await existedFund.update(formattedFundInfo);
    } else {
      console.log('fund insert:', { ...formattedFundInfo, accumulatedNetValue: 'more...', unitNetValue: 'more...' });
      result = await this.ctx.model.Fund.create(formattedFundInfo);
    }
    return result;
  }

  /**
   * 根据基金id爬取基金净值等信息
   * @param fundIdentifier
   * @returns {Promise<*>}
   */
  async fetchByIdentifier(fundIdentifier) {
    try {
      const response = await request(`https://fund.10jqka.com.cn/data/client/myfund/${fundIdentifier}`);
      return JSON.parse(response.body).data[0];
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  /**
   *
   * @param fundIdentifier
   * @returns {Promise<*>}
   */
  async fetchAccumulatedNetValueByIdentifier(fundIdentifier) {
    try {
      const response = await request(`https://fund.10jqka.com.cn/${fundIdentifier}/json/jsonljjz.json`);
      return response.body.split('=')[1];
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async fetchUnitNetValueByIdentifier(fundIdentifier) {
    try {
      const response = await request(`http://fund.10jqka.com.cn/${fundIdentifier}/json/jsondwjz.json`);
      return response.body.split('=')[1];
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}

module.exports = FundService;
