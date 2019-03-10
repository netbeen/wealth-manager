module.exports = {
  schedule: {
    cron: '0 0 2 * * *',
    // cron: '*/10 * * * * *',
    type: 'all', // 指定所有的 worker 都需要执行
  },
  async task(ctx) {
    ctx.logger.info('Start to sync fund info.');
    const fundInfoArray = await ctx.service.fund.getFundByTransaction({});
    fundInfoArray.forEach(async (fund) => {
      const targetFundIdentifier = fund.dataValues.identifier;
      const fundInfo = await ctx.service.fund.fetchByIdentifier(targetFundIdentifier);
      const formattedFundInfo = {
        identifier: fundInfo.code,
        name: fundInfo.name,
        type: fundInfo.fundtype,
        accumulatedNetValue: await ctx.service.fund.fetchAccumulatedNetValueByIdentifier(fundInfo.code),
        unitNetValue: await ctx.service.fund.fetchUnitNetValueByIdentifier(fundInfo.code),
      };
      await ctx.service.fund.saveFundDataToDB(formattedFundInfo);
    });
  },
};
