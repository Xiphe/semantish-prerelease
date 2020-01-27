#!/usr/bin/env node

const run = require('semantic-release');
const envCi = require('env-ci');
const { Writable } = require('stream');
const { exec } = require('child_process');
const Octokit = require('@octokit/rest');

const ci = envCi();
const { branch, prBranch, pr, isPr, slug } = ci;
console.log('CI!!', ci);

function getNextRelease() {
  let nextRelease = {};

  const thisIsNotAPr = {
    ...process.env,
  };
  delete thisIsNotAPr.CIRCLE_PR_NUMBER;
  delete thisIsNotAPr.CIRCLE_PULL_REQUEST;
  delete thisIsNotAPr.CI_PULL_REQUEST;
  return new Promise((resolve, reject) => {
    run(
      {
        plugins: [
          '@semantic-release/commit-analyzer',
          '@semantic-release/npm',
          {
            verifyRelease(opts, { nextRelease: n }) {
              nextRelease = n;
            },
          },
        ],
        branches: [branch || prBranch],
        dryRun: true,
      },
      {
        env: thisIsNotAPr,
        stdout: new Writable({
          write() {
            /* SILENCE! */
          },
        }),
      },
    ).then(() => resolve(nextRelease), reject);
  });
}

(async () => {
  try {
    const { version, gitHead } = await getNextRelease();

    if (!version) {
      console.log(
        'There are no relevant changes, so no new beta version is released.',
      );
      return;
    }

    const preReleaseVersion = `${version}-beta.${gitHead.substring(0, 7)}`;
    await new Promise((resolve, reject) => {
      exec(`npm version ${preReleaseVersion} --no-git-tag-version`, (err) =>
        err ? reject(err) : resolve(),
      );
    });

    await new Promise((resolve, reject) => {
      exec(`npm publish --tag="${branch || prBranch}"`, (err) =>
        err ? reject(err) : resolve(),
      );
    });

    const prefix = await new Promise((resolve, reject) => {
      exec(`npm prefix`, (err, stdout) =>
        err ? reject(err) : resolve(stdout.trim()),
      );
    });

    // eslint-disable-next-line global-require, import/no-dynamic-require
    const { name } = require(`${prefix}/package.json`);

    if (isPr) {
      const [owner, repo] = slug.split('/');

      const octokit = new Octokit({
        auth: process.env.GH_TOKEN,
        userAgent: 'semantish-prerelease v0.1.0',
      });

      const {
        data: { body },
      } = await octokit.pulls.get({
        owner,
        repo,
        pull_number: pr,
      });

      const hasComment = body.match(
        /<!-- semantish-prerelease -->(.|\n|\r)*<!-- \/semantish-prerelease -->/gm,
      );

      const newComment = [
        '<!-- semantish-prerelease -->',
        `<hr /><p><time>(${new Date().toLocaleString('de-DE', {
          timeZone: 'Europe/Berlin',
        })})</date> Pre-released as <code>${name}@${preReleaseVersion}</code></p>`,
        '<!-- /semantish-prerelease -->',
      ].join('\n');

      const newBody = hasComment
        ? body.replace(
            /<!-- semantish-prerelease -->(.|\n|\r)*<!-- \/semantish-prerelease -->/gm,
            newComment,
          )
        : `${body}\n\n${newComment}`;

      await octokit.pulls.update({
        owner,
        repo,
        pull_number: pr,
        body: newBody,
      });
    }

    console.log(`Published ${name}@${preReleaseVersion}`);
  } catch (err) {
    console.error(err);
    process.exit(err.code || 1);
  }
})();
