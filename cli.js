#!/usr/bin/env node
/* eslint-disable no-console */

const proxyquire = require('proxyquire');
const { name, version } = require('./package.json');
const semantishPrerelease = require('./src');
const hidePr = require('./src/hidePr');

console.log(`${name}@${version}`);

proxyquire('semantic-release/cli', {
  '.': (opts) => {
    return semantishPrerelease(opts);
  },
  'env-ci': hidePr(process.argv.includes('--release-pr')),
})().catch((err) => {
  console.error(err);
  process.exit(err.code || 1);
});
