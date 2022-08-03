const getNextVersionOrigin = require('semantic-release/lib/get-next-version');

module.exports = function getNextVersion({ logger, nextRelease, ...rest }) {
  const now = Date.now();
  const timestampToVersion = (v) => v.replace(/\.[0-9]+$/, `.${now}`);
  const version = getNextVersionOrigin({
    ...rest,
    nextRelease,
    logger: {
      ...logger,
      log: (...args) => logger.log(...args.map(timestampToVersion)),
    },
  });

  return timestampToVersion(version);
};
