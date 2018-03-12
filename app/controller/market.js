// import {MarketService} from '../service/market'

const { Controller } = require('egg');

const getParams = (query) => {
  const params = {}
  query.split('&').map((queryItem)=>{
    params[queryItem.split('=')[0]] = queryItem.split('=')[1];
  })
  return params;
}

class MarketController extends Controller {
  async show() {
    // console.log(this.ctx.req._parsedUrl.pathname);
    const [queryCode] = this.ctx.req._parsedUrl.pathname.split('/').reverse();
    console.log('queryCode',queryCode);
    // console.log(this.ctx.req._parsedUrl.query);
    const params = getParams(this.ctx.req._parsedUrl.query);
    console.log('params',params);
    // const [queryCode] = this.ctx.req._parsedUrl.pathname.split('/').reverse();
    // console.log('queryCode',queryCode);
    const result = await this.ctx.service.market.getFundMarket({fundId:'123456'});
    this.ctx.body = result;
  }
}

module.exports = MarketController;

