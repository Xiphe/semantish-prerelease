const getEnvCi = require('env-ci');

module.exports = function hidePr(releasePr) {
  return (subContext) => {
    const envCi = getEnvCi(subContext);
    if (
      !envCi.isCi ||
      !releasePr ||
      envCi.name === 'Bamboo' ||
      envCi.name === 'Bitbucket Pipelines' ||
      envCi.name === 'AWS CodeBuild' ||
      envCi.name === 'Codeship' ||
      envCi.name === 'GitLab CI/CD' ||
      envCi.name === 'TeamCity' ||
      envCi.name === 'Jenkins' ||
      envCi.name === 'Wercker' ||
      !envCi.pr
    ) {
      return envCi;
    }

    const branch =
      envCi.name === 'GitHub Actions'
        ? process.env.GITHUB_HEAD_REF
        : envCi.branch || envCi.prBranch;

    return {
      ...envCi,
      isPr: false,
      pr: undefined,
      prBranch: undefined,
      branch,
    };
  };
};
