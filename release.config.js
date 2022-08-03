const PR_COMMENT_TEMPLATE = `## Test this PR 🧪

\`\`\`bash
# published at <% print(date.toISOString()) %>
npm install semantish-prerelease@<%= version %>
\`\`\``;

module.exports = {
  branches: [
    '+([0-9])?(.{+([0-9]),x}).x',
    'main',
    'next',
    'next-major',
    { name: 'beta', prerelease: true },
    { name: 'alpha', prerelease: true },
  ],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/npm',
    process.env.PRE_RELEASE && [
      'decorate-gh-pr/on-release',
      { prepend: false, comment: PR_COMMENT_TEMPLATE },
    ],
    !process.env.PRE_RELEASE && '@semantic-release/github',
  ].filter(Boolean),
};
