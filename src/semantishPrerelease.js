const proxyquire = require('proxyquire');
const getEnvCi = require('env-ci');
const defaultGetOptions = require('./getOptions');
const defaultGetNextVersion = require('./getNextVersion');
const defaultGit = require('./git');

module.exports = async function semantishPrerelease(
  options,
  {
    cwd = process.cwd(),
    env = process.env,
    stdout = process.stdout,
    stderr = process.stderr,
  } = {},
  getOptions = defaultGetOptions,
  getNextVersion = defaultGetNextVersion,
  git = defaultGit,
) {
  const context = { cwd, env, stdout, stderr, envCi: getEnvCi({ env, cwd }) };
  return proxyquire('semantic-release', {
    './lib/get-next-version': getNextVersion,
    './lib/git': git,
  })(await getOptions(options, context), context);
};
