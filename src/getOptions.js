const getConfig = require('semantic-release/lib/get-config');
const getCiBranch = require('./getCiBranch');

const IGNORE_PLUGINS = ['@semantic-release/gitlab', '@semantic-release/github'];

module.exports = async function getOptions(opts, { cwd, env, envCi }) {
  const branch = getCiBranch(envCi) || 'unknown';

  const config = await getConfig(
    {
      cwd,
      env,
      logger: { success() {} },
    },
    opts,
  );

  const options = {
    ...opts,
    plugins: (config.options.plugins || []).filter((pluginName) => {
      if (IGNORE_PLUGINS.includes(pluginName)) {
        /* eslint-disable-next-line no-console */
        console.warn(`Removing ${pluginName} plugin for pre-releases`);
        return false;
      }
      return true;
    }),
    branches: [
      {
        name: branch,
        channel: branch,
        prerelease: branch.replace(/[^0-9A-Za-z-]/g, '-').replace(/-+/g, '-'),
      },
      ...(config.options.branches || []),
    ],
  };
  console.log('Semantish prerelease options:', options, { envCi });
  return options;
};
