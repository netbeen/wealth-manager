const { Service } = require('egg');

class MarketService extends Service {
  // 默认不需要提供构造函数。
  // constructor(ctx) {
  //   super(ctx); 如果需要在构造函数做一些处理，一定要有这句话，才能保证后面 `this.ctx`的使用。
  //   // 就可以直接通过 this.ctx 获取 ctx 了
  //   // 还可以直接通过 this.app 获取 app 了
  // }

  // getFundPriceByIdAndStartDate = (fundId, startDate, days) => {
  //
  //
  // }

  async getFundMarket({fundId}){
    console.log('fundId',fundId);
    if(fundId && typeof fundId !== 'string'){
      return {code: 400};
    }
    const result = await this.ctx.curl('http://fund.eastmoney.com/f10/F10DataApi.aspx?type=lsjz&code=' + fundId + '&page=1&per=20000', { dataType: 'text' });
    let valueJson = {};
    for(let elem of result.data.split('<tr><td>').slice(1, -1)){
      let sliceArray = elem.split('</td><td class=\'tor bold\'>').slice(0, 2);
      valueJson[sliceArray[0]] = parseFloat(sliceArray[1]);
    }
    return {
      code: 200,
      results: valueJson,
    };
  }
}
module.exports = MarketService;
