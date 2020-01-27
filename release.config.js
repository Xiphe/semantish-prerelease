const { branch, ...rest } = require('env-ci')();

const DEFAULT_BRANCH = 'master';

console.log(branch, rest);

module.exports = {
  branches: [DEFAULT_BRANCH, { name: '*', prerelease: true }],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/npm',
    branch === DEFAULT_BRANCH && '@semantic-release/github',
  ].filter(Boolean),
};
