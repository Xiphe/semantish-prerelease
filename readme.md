# semantish-prerelease

[![CircleCI](https://circleci.com/gh/Xiphe/semantish-prerelease/tree/main.svg?style=shield)](https://circleci.com/gh/Xiphe/semantish-prerelease/tree/main)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![semantish-prerelease](https://img.shields.io/badge/%F0%9F%93%A6%F0%9F%9B%B8-semantish--prerelease-d86b86.svg)](https://github.com/Xiphe/semantish-prerelease)

Adapting [semantic-release](https://github.com/semantic-release/semantic-release)
to create pre-releases without git-tags, github-releases and with a timestamp
instead of a incremental counter.

~~1.0.2-next.1~~  
`1.0.2-next.1659519570622`

## Usage

In a CI environment, this will file a pre-release of the current branch.
The CI should be configured in a way that the command is not run on branches
that should not be pre-released (e.g. `main`).

```
npx semantish-prerelease
```

## Configuration

Almost all [configuration of semantic-release](https://github.com/semantic-release/semantic-release/blob/main/docs/usage/configuration.md) is being passed through (including cli args).

### `--release-pr`

```bash
# cli
semantish-prerelease --release-pr
```

```js
// lib
require('semantish-prerelease')({ releasePr: true });
```

force releases even on CI runs for a pull request.

semantic-release normally skips PR runs assuming there is a non-pr (branch) run.
But CircleCi for example only has one run for the PR and none for the branch.

### customizing config for pre-releases

Before reading the config, a `PRE_RELEASE` environment variable is exposed so that
the config can be customized for pre-releases using a `release.config.js` file.

```js
// release.config.js
const isStable = !process.env.PRE_RELEASE;

module.exports = {
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/npm',
    isStable && 'semantic-release-slack-bot',
    isStable && '@semantic-release/github',
  ].filter(Boolean),
};
```

Note that `@semantic-release/github` and `@semantic-release/gitlab` are always removed since they also create tags on the git remote.

## Running in CI PRs

semantic release refuses to work on CI runs for Pull Requests.
This is because some CI's run twice for PRs (once for the branch + once for the PR).
In other CI's there is only one run for both, the branch + the PR

You need to make sure that the PR-identifying environment variables are unset
before running semantish-prerelease

For example on CircleCI:

`unset CIRCLE_PR_NUMBER; unset CIRCLE_PULL_REQUEST; unset CI_PULL_REQUEST; npx semantish-prerelease`

## Motivation

When working with PRs then:

- I want each commit on every Pull request to be released. In order to test the change in dependant projects.
- I want to write commit messages for the final changelog of the release branch. Not for the WIP branch.
- I want to rebase the branch. In order to keep git history clean and apply fixes to older commits.

The current [pre-release concepts and workflows of semantic release](https://github.com/semantic-release/semantic-release/blob/master/docs/recipes/pre-releases.md#publishing-pre-releases)
[don't seem to support this, neither intend to](https://github.com/semantic-release/semantic-release/issues/1433).

### Problem 1: triggering pre-releases

Semantic release keeps track of prior versions using git tags, this also applies
for pre-releases. When a WIP branch is released, a pre-release tag
(`1.0.2-next.1`) is attached to a commit in that branch.

- 🐞 If `1.0.2-next.1` contained a bug, we now need to follow the
  commit-guidelines to properly write a fix commit to a problem that never made it
  to a official release (`fix: remove problem that only existed in v1.0.2-next.1`).
- 👻 This commit does not make sense for the main changelog.
- 🔨 An option would be to squash merge the wip branch.
- 🤯 But then there is no reason to follow the commit message format inside the
  wip branch anymore.

I find this dissatisfying 😢.

The fix is to **not** keep track of prior pre-release versions but instead
always check the complete history of the wip branch against the latest stable
release.
This causes **each** commit in a wip branch to trigger a release as long as
**any** commit would trigger one on the main release branch.

### Problem 2: detached git tags

Another approach would be to **rebase** and fix the problem by editing the
commit that triggered `1.0.2-next.1` 👍. This causes clean history that
can be merged/rebased into the main branch and leads to a precise changelog 🥰.

Now remember semantic release keeps track of prior (pre-)releases using git tags.
If our branch is being rebased, the tag now points to a detached commit.
This causes the next release to fail because the prior tag is not found and the
next version is again `1.0.2-next.1`, which already exists.

This also happens when we're not using git tags to track prior versions at all
(see solution of problem 1).

We're fixing this by using a timestamp instead of a incremental counter
so each commit always gets a unique version (`1.0.2-next.1659519570622`).

## Badge

Let people know that your package is pre-published using **semantish-prerelease** by including this badge in your readme.

[![semantish-prerelease](https://img.shields.io/badge/%F0%9F%93%A6%F0%9F%9B%B8-semantish--prerelease-d86b86.svg)](https://github.com/Xiphe/semantish-prerelease)

```
[![semantish-prerelease](https://img.shields.io/badge/%F0%9F%93%A6%F0%9F%9B%B8-semantish--prerelease-d86b86.svg)](https://github.com/Xiphe/semantish-prerelease)
```

## License

> The MIT License
>
> Copyright (C) 2022 Hannes Diercks
>
> Permission is hereby granted, free of charge, to any person obtaining a copy of
> this software and associated documentation files (the "Software"), to deal in
> the Software without restriction, including without limitation the rights to
> use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
> of the Software, and to permit persons to whom the Software is furnished to do
> so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
> FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
> COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
> IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
> CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
