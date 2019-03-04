module.exports = {
  schedule: {
    cron: '0 0 2 * * *',
    type: 'all', // 指定所有的 worker 都需要执行
  },
  async task(ctx) {
    const fundInfo = await ctx.service.fund.fetchByIdentifier('160119');
    const formattedFundInfo = {
      identifier: fundInfo.code,
      name: fundInfo.name,
      type: fundInfo.fundtype,
      accumulatedNetValue: await ctx.service.fund.fetchAccumulatedNetValueByIdentifier(fundInfo.code),
      unitNetValue: await ctx.service.fund.fetchUnitNetValueByIdentifier(fundInfo.code),
    };
    await ctx.service.fund.saveFundDataToDB(formattedFundInfo);
  },
};
