import fs from 'fs';
import jsonfile from 'jsonfile';
import chunk from 'lodash/chunk';
import path from 'path';

import debugGithubRepos from '../debug-github-repos.json';
import * as Strings from '../src/util/strings';
import githubRepos from '../style-libraries.json';
import calculateScore from './calculate-score';
import { fetchGithubData, fetchGithubRateLimit, loadGitHubLicenses } from './fetch-github-data';
import fetchNpmData from './fetch-npm-data';
import fetchReadmeImages from './fetch-readme-images';

// Uses debug-github-repos.json instead, so we have less repositories to crunch
// each time we run the script
const USE_DEBUG_REPOS = false;

// Loads the Github API results from disk rather than hitting the API each time.
// The first run will hit the API if raw-github-results.json doesn't exist yet.
const LOAD_GITHUB_RESULTS_FROM_DISK = false;
const GITHUB_RESULTS_PATH = path.join('scripts', 'raw-github-results.json');

const JSON_OPTIONS = {
  spaces: 2,
};

export const sleep = (ms = 0) => {
  return new Promise((r) => setTimeout(r, ms));
};

let invalidRepos = [];

const buildAndScoreData = async () => {
  console.log('** Loading data from GitHub');
  let data = await loadRepositoryDataAsync();

  data = data.filter((project) => {
    if (!project.github || Strings.isEmptyOrNull(project.github.name)) {
      invalidRepos.push(project.githubUrl);
      return false;
    }
    return !Strings.isEmptyOrNull(project.github.name);
  });

  console.log('\n** Scraping images from README');
  await sleep(1000);
  data = await Promise.all(data.map((d) => fetchReadmeImages(d, d.githubUrl)));

  console.log('\n** Loading download stats from npm');
  await sleep(1000);
  data = await Promise.all(data.map((d) => fetchNpmData(d, d.npmPkg, d.githubUrl)));

  // Calculate score
  console.log('\n** Calculating scores');
  data = data.map((project) => {
    try {
      return calculateScore(project);
    } catch (e) {
      console.log(`Failed to calculate score for ${project.github.name}`);
      console.log(e.message);
      console.log(project.githubUrl);
    }
  });

  // Process topic counts
  const topicCounts = {};
  data.forEach((project, index, projectList) => {
    let topicSearchString = '';

    if (project.github.topics) {
      project.github.topics.forEach((topic) => {
        topicSearchString = `${topicSearchString} ${topic}`;

        if (!topicCounts[topic]) {
          topicCounts[topic] = 1;
          return;
        }

        topicCounts[topic] += 1;
      });
    }

    projectList[index].topicSearchString = topicSearchString.trim();
  });

  if (invalidRepos.length) {
    console.log(
      '** The following repositories were unable to fetch from GitHub, they may need to be removed from style-libraries.json:'
    );
    invalidRepos.forEach((repoUrl) => console.log(`- ${repoUrl}`));
  }

  return jsonfile.writeFile(
    path.resolve('src/assets', 'data.json'),
    {
      libraries: data,
      topics: topicCounts,
      topicsList: Object.keys(topicCounts).sort(),
    },
    JSON_OPTIONS,
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('');
        console.log('** Done!');
      }
    }
  );
};

async function fetchGithubDataThrottled({ data, chunkSize, staggerMs }) {
  let results = [];
  let chunks = chunk(data, chunkSize);
  for (let c of chunks) {
    if (chunks.indexOf(c) > 0) {
      console.log(`${results.length} of ${data.length} fetched`);
      console.log(`Sleeping ${staggerMs}ms`);
      await sleep(staggerMs);
    }

    let partialResult = await Promise.all(c.map(fetchGithubData));
    results = [...results, ...partialResult];

    if (partialResult.length !== c.length) {
      throw new Error(
        `Error in fetching data from GitHub... Expected ${c.length} results but only received ${partialResult.length}`
      );
    }
  }

  return results;
}

async function loadRepositoryDataAsync() {
  let data = USE_DEBUG_REPOS ? debugGithubRepos : githubRepos;
  let githubResultsFileExists = false;
  try {
    fs.statSync(GITHUB_RESULTS_PATH);
    githubResultsFileExists = true;
  } catch (e) {}

  let { apiLimit, apiLimitRemaining, apiLimitCost } = await fetchGithubRateLimit();

  // 5000 requests per hour is the authenticated API request rate limit
  if (!apiLimit || apiLimit < 5000) {
    throw new Error('GitHub API token is invalid or query is not properly configured.');
  }

  // Error out if not enough remaining
  if (apiLimitRemaining < data.length * apiLimitCost) {
    throw new Error('Not enough requests left on GitHub API rate limiting to proceed.');
  }

  console.info(
    `${apiLimitRemaining} of ${apiLimit} GitHub API requests remaining for the hour at a cost of ${apiLimitCost} per request`
  );

  await loadGitHubLicenses();

  let result;
  if (LOAD_GITHUB_RESULTS_FROM_DISK && githubResultsFileExists) {
    result = jsonfile.readFileSync(GITHUB_RESULTS_PATH);
    console.log('Loaded Github results from disk, skipped API calls');
  } else {
    result = await fetchGithubDataThrottled({ data, chunkSize: 25, staggerMs: 5000 });

    if (LOAD_GITHUB_RESULTS_FROM_DISK) {
      await new Promise((resolve, reject) => {
        jsonfile.writeFile(GITHUB_RESULTS_PATH, result, JSON_OPTIONS, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
      console.log('Saved Github results from disk');
    }
  }

  return result;
}

buildAndScoreData();
