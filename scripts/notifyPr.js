const { name, version } = require('../package.json');

module.exports = () => {
  if (version && version !== '0.0.0-development' && version.match(/-/)) {
    return `<hr /><code>npm install ${name}@${version}</code>`;
  }
  return undefined;
};
