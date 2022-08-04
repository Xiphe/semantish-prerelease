const getNextVersionOrigin = require('semantic-release/lib/get-next-version');

module.exports = function getNextVersion({ logger, nextRelease, ...rest }) {
  const now = new Date();
  const humanReadableTimestamp = `${String(now.getFullYear()).substring(
    2,
  )}${String(now.getMonth() + 1).padStart(2, '0')}${String(
    now.getDate(),
  ).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(
    now.getMinutes(),
  ).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

  const timestampToVersion = (v) =>
    v.replace(/\.[0-9]+$/, `.${humanReadableTimestamp}`);
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
