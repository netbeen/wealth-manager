module.exports = () => async function recordUrl(ctx, next) {
  ctx.logger.info('visit:', `${ctx.request.header.host}${ctx.request.url}`);
  return next();
};
