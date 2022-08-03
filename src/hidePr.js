const getEnvCi = require('env-ci');

module.exports = function hidePr(releasePr) {
  return (subContext) => {
    const envCi = getEnvCi(subContext);
    if (!releasePr || !envCi.pr) {
      return envCi;
    }

    return {
      ...envCi,
      isPr: false,
      pr: undefined,
      prBranch: undefined,
      branch: envCi.branch || envCi.prBranch,
    };
  };
};
