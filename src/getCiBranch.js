/**
 * @param {import('env-ci').CiEnv} envCi
 * @returns {undefined | string}
 */
module.exports = function getCiBranch(envCi) {
  if (!envCi.isCi) {
    return undefined;
  }

  return envCi.name === 'GitHub Actions' && envCi.isPr
    ? process.env.GITHUB_HEAD_REF
    : envCi.branch || envCi.prBranch;
};
