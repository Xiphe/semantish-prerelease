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
  Object.assign(env, { PRE_RELEASE: 'true' });
  const context = { cwd, env, stdout, stderr, envCi: getEnvCi({ env, cwd }) };
  return proxyquire('semantic-release', {
    './lib/get-next-version': getNextVersion,
    './lib/git': git,
    'env-ci': (subContext) => ({
      ...getEnvCi(subContext),
      ...(options.releasePr
        ? { isPr: false, pr: undefined, prBranch: undefined }
        : {}),
    }),
  })(await getOptions(options, context), context);
};
