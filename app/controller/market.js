// import {MarketService} from '../service/market'

const { Controller } = require('egg');

const getParams = (query) => {
  if(!query){
    return {};
  }
  const params = {}
  query.split('&').map((queryItem)=>{
    params[queryItem.split('=')[0]] = queryItem.split('=')[1];
  })
  return params;
}

class MarketController extends Controller {
  async show() {
    const [queryCode] = this.ctx.req._parsedUrl.pathname.split('/').reverse();
    const params = getParams(this.ctx.req._parsedUrl.query);
    const result = await this.ctx.service.market.getFundMarket({...{fundId:queryCode},...params});
    this.ctx.body = result;
  }
}

module.exports = MarketController;

