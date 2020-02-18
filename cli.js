#!/usr/bin/env node
/* eslint-disable no-console */

const proxyquire = require('proxyquire');
const { name, version } = require('./package.json');
const semantishPrerelease = require('./src');

console.log(`${name}@${version}`);

proxyquire('semantic-release/cli', {
  '.': (opts) => {
    return semantishPrerelease(opts);
  },
})().catch((err) => {
  console.error(err);
  process.exit(err.code || 1);
});
