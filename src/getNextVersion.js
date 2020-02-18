const getNextVersionOrigin = require('semantic-release/lib/get-next-version');

module.exports = function getNextVersion({ logger, nextRelease, ...rest }) {
  const { gitHead } = nextRelease;
  const gitHeadToVersion = (v) =>
    v.replace(/\.[0-9]+$/, `.${gitHead.substring(0, 7)}`);
  const version = getNextVersionOrigin({
    ...rest,
    nextRelease,
    logger: {
      ...logger,
      log: (...args) => logger.log(...args.map(gitHeadToVersion)),
    },
  });

  return gitHeadToVersion(version);
};
