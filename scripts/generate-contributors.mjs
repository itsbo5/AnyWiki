import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const UPSTREAM_DIR = process.env.ANYPS5_DIR || 'C:\\Users\\Omar\\Documents\\GitHub\\AnyPS5';
const OUTPUT_FILE = path.resolve('src/data/contributors.json');

const BOTS = new Set([
  'github-actions',
  'github-actions[bot]',
  'dependabot[bot]',
  'dependabot',
  'renovate',
  'renovate[bot]',
  'ci',
]);

function extractContributors() {
  if (!fs.existsSync(UPSTREAM_DIR)) {
    if (fs.existsSync(OUTPUT_FILE)) {
      console.log('Upstream repo not found, using committed contributors snapshot.');
      return;
    }
    throw new Error(`Upstream repo not found at ${UPSTREAM_DIR} and no snapshot exists.`);
  }

  console.log(`Extracting contributors and PR history from ${UPSTREAM_DIR}...`);
  // Read merged PR subjects
  const logOutput = execSync('git log --grep="Merge pull request #" -n 1000 --format="%s"', {
    cwd: UPSTREAM_DIR,
    encoding: 'utf-8',
    maxBuffer: 20 * 1024 * 1024,
  });

  const lines = logOutput.split(/\r?\n/).filter(Boolean);
  const userMap = new Map();

  const prRegex = /^Merge pull request #(\d+) from ([^/]+)\/(.+)$/;

  for (const line of lines) {
    const match = line.match(prRegex);
    if (!match) continue;
    const [, prNum, author, branch] = match;
    const cleanAuthor = author.trim();
    if (BOTS.has(cleanAuthor.toLowerCase())) continue;

    if (!userMap.has(cleanAuthor)) {
      userMap.set(cleanAuthor, {
        username: cleanAuthor,
        prCount: 0,
        prs: [],
        areas: new Set(),
      });
    }

    const userData = userMap.get(cleanAuthor);
    userData.prCount++;
    userData.prs.push({
      pr: parseInt(prNum, 10),
      branch: branch.trim(),
    });

    // Extract area from branch name
    const branchParts = branch.split('/');
    if (branchParts.length >= 2) {
      const topic = branchParts[1];
      if (topic.startsWith('libSce') || topic.startsWith('libkernel') || topic.startsWith('libc')) {
        userData.areas.add(topic.split('-')[0]);
      } else if (topic.includes('agc') || topic.includes('gpu')) {
        userData.areas.add('Graphics/AGC');
      } else if (topic.includes('shader') || topic.includes('spirv')) {
        userData.areas.add('Shader recompiler');
      } else if (topic.includes('relinker')) {
        userData.areas.add('Relinker');
      } else if (branchParts[0] === 'docs') {
        userData.areas.add('Documentation');
      } else if (branchParts[0] === 'test') {
        userData.areas.add('Tests');
      } else {
        userData.areas.add(branchParts[0]);
      }
    }
  }

  // Also read commit counts from shortlog
  const shortlogOutput = execSync('git shortlog -sn --no-merges', {
    cwd: UPSTREAM_DIR,
    encoding: 'utf-8',
    maxBuffer: 20 * 1024 * 1024,
  });

  const shortlogLines = shortlogOutput.split(/\r?\n/).filter(Boolean);
  const authorCommitCounts = new Map();
  for (const line of shortlogLines) {
    const match = line.trim().match(/^(\d+)\s+(.+)$/);
    if (match) {
      const count = parseInt(match[1], 10);
      const name = match[2].trim();
      authorCommitCounts.set(name, count);
    }
  }

  const result = Array.from(userMap.values())
    .map(user => {
      // Create plain description of contributions
      const areaList = Array.from(user.areas).slice(0, 3);
      const desc = areaList.length > 0
        ? `Contributed to ${areaList.join(', ')}`
        : `Contributed ${user.prCount} pull request${user.prCount > 1 ? 's' : ''}`;
      return {
        username: user.username,
        prCount: user.prCount,
        summary: desc,
        recentPrs: user.prs.slice(0, 5),
      };
    })
    .sort((a, b) => b.prCount - a.prCount);

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2) + '\n', 'utf-8');
  console.log(`Wrote ${result.length} contributors to ${OUTPUT_FILE}`);
}

extractContributors();
