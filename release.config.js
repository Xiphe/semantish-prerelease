const { branch } = require('env-ci');
const releaseNpm = require('@semantic-release/npm');

const DEFAULT_BRANCH = 'master';

function toBetaVersion(origin) {
  return (config, context) => {
    return origin(config, {
      ...context,
      nextRelease: {
        ...context.nextRelease,
        channel: branch,
        version: `${
          context.nextRelease.version
        }-beta.${context.nextRelease.gitHead.substring(0, 7)}`,
      },
    });
  };
}

const npmPrerelease = {
  ...releaseNpm,
  prepare: toBetaVersion(releaseNpm.prepare),
  release: toBetaVersion(releaseNpm.release),
};

module.exports = {
  branches: [DEFAULT_BRANCH, { name: '*', channel: 'beta', prerelease: true }],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    branch === DEFAULT_BRANCH ? '@semantic-release/npm' : npmPrerelease,
    branch === DEFAULT_BRANCH && '@semantic-release/github',
  ].filter(Boolean),
};
