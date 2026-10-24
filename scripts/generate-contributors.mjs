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

const USERNAME_ALIASES = {
  'dean': 'oneandonlydean',
  'dean galvin': 'oneandonlydean',
  'adrià': 'adriadam10',
  'adrià franch': 'adriadam10',
  'adria': 'adriadam10',
  'federico marras': 'MarrasFederico',
  'yossi yadgar': 'YossiYad',
  'hypermist': 'hypermoist',
};

function extractContributors() {
  if (!fs.existsSync(UPSTREAM_DIR)) {
    if (fs.existsSync(OUTPUT_FILE)) {
      console.log('Upstream repo not found, using committed contributors snapshot.');
      return;
    }
    throw new Error(`Upstream repo not found at ${UPSTREAM_DIR} and no snapshot exists.`);
  }

  console.log(`Extracting all contributors and PR history from ${UPSTREAM_DIR}...`);

  // 1. Read all merge commits
  const logOutput = execSync('git log --merges --format="%s"', {
    cwd: UPSTREAM_DIR,
    encoding: 'utf-8',
    maxBuffer: 50 * 1024 * 1024,
  });

  const lines = logOutput.split(/\r?\n/).filter(Boolean);
  const userMap = new Map();

  const prRegex = /^Merge pull request #(\d+) from ([^/]+)\/(.+)$/;

  for (const line of lines) {
    const match = line.match(prRegex);
    if (!match) continue;
    const [, prNum, author, branch] = match;
    let cleanAuthor = author.trim();
    if (BOTS.has(cleanAuthor.toLowerCase())) continue;

    const aliasKey = cleanAuthor.toLowerCase();
    if (USERNAME_ALIASES[aliasKey]) {
      cleanAuthor = USERNAME_ALIASES[aliasKey];
    }

    if (!userMap.has(cleanAuthor)) {
      userMap.set(cleanAuthor, {
        username: cleanAuthor,
        commits: 0,
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

  // 2. Read direct commits for all authors
  const commitLog = execSync('git log --no-merges --format="%an|%ae"', {
    cwd: UPSTREAM_DIR,
    encoding: 'utf-8',
    maxBuffer: 50 * 1024 * 1024,
  });

  const commitLines = commitLog.split(/\r?\n/).filter(Boolean);
  for (const line of commitLines) {
    const [name, email] = line.split('|');
    const cleanName = name ? name.trim() : '';
    if (!cleanName || BOTS.has(cleanName.toLowerCase())) continue;

    // Check alias
    let mappedUser = cleanName;
    const aliasKey = cleanName.toLowerCase();
    if (USERNAME_ALIASES[aliasKey]) {
      mappedUser = USERNAME_ALIASES[aliasKey];
    } else if (email && email.includes('users.noreply.github.com')) {
      const emailUser = email.split('@')[0].replace(/^\d+\+/, '');
      if (emailUser && !BOTS.has(emailUser.toLowerCase())) {
        mappedUser = emailUser;
      }
    }

    if (!userMap.has(mappedUser)) {
      userMap.set(mappedUser, {
        username: mappedUser,
        commits: 0,
        prCount: 0,
        prs: [],
        areas: new Set(),
      });
    }

    userMap.get(mappedUser).commits++;
  }

  // Special handling for creator boykopovar
  if (userMap.has('boykopovar')) {
    const boyko = userMap.get('boykopovar');
    boyko.areas.add('Project Creator');
    boyko.areas.add('Relinker core');
    boyko.areas.add('PRX system libraries');
    boyko.areas.add('Architecture');
  }

  const result = Array.from(userMap.values())
    .filter(u => u.commits > 0 || u.prCount > 0)
    .map(user => {
      const areaList = Array.from(user.areas).slice(0, 3);
      const desc = areaList.length > 0
        ? areaList.join(', ')
        : (user.commits > 0 ? `${user.commits} commits` : `${user.prCount} pull requests`);

      return {
        username: user.username,
        commits: user.commits,
        prCount: user.prCount,
        totalContributions: user.commits + user.prCount,
        summary: desc,
        recentPrs: user.prs.slice(0, 5),
      };
    })
    .sort((a, b) => b.totalContributions - a.totalContributions);

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2) + '\n', 'utf-8');
  console.log(`Wrote ${result.length} contributors to ${OUTPUT_FILE}`);
}

extractContributors();
