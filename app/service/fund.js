// app/service/fund.js
const { Service } = require('egg');
const request = require('async-request');

/**
 *
 */
class FundService extends Service {
  async getFundByTransaction({ userId }) {
    const whereQuery = {};
    if (userId) {
      whereQuery.userId = userId;
    }
    const existedFundTransactions = await this.ctx.model.FundTransaction.findAll({
      where: whereQuery,
    });
    const fundIds = Array.from(new Set((existedFundTransactions).map(item => item.fundId)));
    const fundInfoArray = await this.ctx.model.Fund.findAll({
      where: {
        id: fundIds,
      },
    });
    return fundInfoArray;
  }

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
      this.ctx.logger.info('fund update:', {
        ...formattedFundInfo,
        accumulatedNetValue: `[${formattedFundInfo.accumulatedNetValue.length}]`,
        unitNetValue: `[${formattedFundInfo.accumulatedNetValue.length}]`,
      });
      result = await existedFund.update(formattedFundInfo);
    } else {
      this.ctx.logger.info('fund insert:', { ...formattedFundInfo, accumulatedNetValue: 'more...', unitNetValue: 'more...' });
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
      this.ctx.logger.info(e);
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
      this.ctx.logger.info(e);
      return null;
    }
  }

  async fetchUnitNetValueByIdentifier(fundIdentifier) {
    try {
      const response = await request(`http://fund.10jqka.com.cn/${fundIdentifier}/json/jsondwjz.json`);
      return response.body.split('=')[1];
    } catch (e) {
      this.ctx.logger.info(e);
      return null;
    }
  }
}

module.exports = FundService;
