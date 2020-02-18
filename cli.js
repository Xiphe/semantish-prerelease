#!/usr/bin/env node

const proxyquire = require('proxyquire');
const semantishPrerelease = require('./src');

proxyquire('semantic-release/cli', {
  '.': (opts) => {
    return semantishPrerelease(opts);
  },
})().catch((err) => {
  /* eslint-disable-next-line no-console */
  console.error(err);
  process.exit(err.code || 1);
});
