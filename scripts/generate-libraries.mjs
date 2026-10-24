import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';

const UPSTREAM_DIR = process.env.ANYPS5_DIR || 'C:\\Users\\Omar\\Documents\\GitHub\\AnyPS5';
const PROGRESS_SNAPSHOT = path.resolve('src/data/progress.json');
const COMMIT_FILE = path.resolve('src/data/commit.json');
const LIBRARIES_INDEX = path.resolve('src/data/libraries.json');
const LIBRARIES_DIR = path.resolve('src/data/libraries');

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-";
const SUFFIX = Buffer.from([
  0x51, 0x8D, 0x64, 0xA6, 0x35, 0xDE, 0xD8, 0xC1,
  0xE6, 0xB0, 0x39, 0xB1, 0xC3, 0xE5, 0x52, 0x30
]);

function computeNid(symbol) {
  const hash = crypto.createHash("sha1").update(Buffer.concat([Buffer.from(symbol, "utf8"), SUFFIX])).digest();
  const rev = Buffer.alloc(8);
  for (let i = 0; i < 8; i++) rev[i] = hash[7 - i];
  let out = "";
  for (let i = 0; i < 6; i += 3) {
    const triple = (rev[i] << 16) | (rev[i + 1] << 8) | rev[i + 2];
    out += CHARSET[(triple >> 18) & 63] + CHARSET[(triple >> 12) & 63] + CHARSET[(triple >> 6) & 63] + CHARSET[triple & 63];
  }
  const tail = (rev[6] << 16) | (rev[7] << 8);
  out += CHARSET[(tail >> 18) & 63] + CHARSET[(tail >> 12) & 63] + CHARSET[(tail >> 6) & 63];
  return out;
}

function getCategory(name) {
  if (name.startsWith('libc') || name.startsWith('libkernel') || name === 'ulobjmgr' || name.startsWith('libmdbg')) {
    return 'Core system';
  }
  if (name.includes('Agc') || name.includes('Video') || name.includes('Vdec') || name.includes('Venc')) {
    return 'Graphics and video';
  }
  if (name.includes('Audio') || name.includes('Ajm') || name.includes('Acm') || name.includes('At9') ||
      name.includes('Opus') || name.includes('Vorbis') || name.includes('Voice') || name.includes('Ngs2') ||
      name.includes('AvPlayer') || name.includes('Ac3')) {
    return 'Audio and media';
  }
  if (name.includes('Pad') || name.includes('Mouse') || name.includes('Keyboard') || name.includes('Ime') ||
      name.includes('User') || name.includes('Keycode') || name.includes('Gesture')) {
    return 'Input and user';
  }
  if (name.includes('Net') || name.includes('Http') || name.includes('Ssl') || name.includes('Np') ||
      name.includes('Rudp') || name.includes('SaveData') || name.includes('Trophy') || name.includes('PlayGo')) {
    return 'Network and services';
  }
  return 'System utilities';
}

function generate() {
  let commitInfo = {
    hash: '5b65588957f8b2020adb1f264a3d9408c997297f',
    date: 'Sat Oct 24 17:22:08 2026 +0400',
    subject: 'perf(agc): allow direct GPU presentation for 8-bit resident images on 10-bit displays'
  };

  let progressData;

  if (fs.existsSync(UPSTREAM_DIR)) {
    console.log(`Running upstream progress analysis from ${UPSTREAM_DIR}...`);
    try {
      const commitRaw = execSync('git log -1 --format="%H|%cd|%s"', { cwd: UPSTREAM_DIR, encoding: 'utf-8' }).trim();
      const parts = commitRaw.split('|');
      if (parts.length >= 3) {
        commitInfo = { hash: parts[0], date: parts[1], subject: parts.slice(2).join('|') };
      }
    } catch {
      // Keep default
    }

    try {
      const progressOutput = execSync('python tools/progress.py --json', {
        cwd: UPSTREAM_DIR,
        encoding: 'utf-8',
        maxBuffer: 50 * 1024 * 1024,
      });
      progressData = JSON.parse(progressOutput);
      fs.mkdirSync(path.dirname(PROGRESS_SNAPSHOT), { recursive: true });
      fs.writeFileSync(PROGRESS_SNAPSHOT, JSON.stringify(progressData, null, 2) + '\n', 'utf-8');
      console.log(`Updated progress snapshot at ${PROGRESS_SNAPSHOT}`);
    } catch (err) {
      console.warn(`Could not run progress.py (${err.message}). Falling back to snapshot.`);
    }
  }

  if (!progressData) {
    if (!fs.existsSync(PROGRESS_SNAPSHOT)) {
      throw new Error(`No progress snapshot found at ${PROGRESS_SNAPSHOT} and upstream not available.`);
    }
    progressData = JSON.parse(fs.readFileSync(PROGRESS_SNAPSHOT, 'utf-8'));
  }

  fs.mkdirSync(path.dirname(COMMIT_FILE), { recursive: true });
  fs.writeFileSync(COMMIT_FILE, JSON.stringify(commitInfo, null, 2) + '\n', 'utf-8');

  fs.mkdirSync(LIBRARIES_DIR, { recursive: true });

  const groups = progressData.libraries.groups || [];
  const indexEntries = [];

  for (const group of groups) {
    const doneSet = new Set(group.done_names || []);
    const todoSet = new Set(group.todo_names || []);
    const inertSet = new Set(group.inert_names || []);

    const allNames = Array.from(new Set([...doneSet, ...todoSet])).sort();
    const functions = [];

    let implementedCount = 0;
    let inertCount = 0;
    let stubCount = 0;

    for (const funcName of allNames) {
      let state = 'implemented';
      if (todoSet.has(funcName)) {
        state = 'stub';
        stubCount++;
      } else if (inertSet.has(funcName)) {
        state = 'inert';
        inertCount++;
      } else {
        implementedCount++;
      }

      functions.push({
        name: funcName,
        nid: computeNid(funcName),
        state,
      });
    }

    const category = getCategory(group.name);
    const libData = {
      name: group.name,
      label: group.label,
      category,
      implemented: implementedCount,
      inert: inertCount,
      stub: stubCount,
      total: functions.length,
      sharedSources: group.shared_sources || null,
      functions,
    };

    const libFilePath = path.join(LIBRARIES_DIR, `${group.name}.json`);
    fs.writeFileSync(libFilePath, JSON.stringify(libData, null, 2) + '\n', 'utf-8');

    indexEntries.push({
      name: group.name,
      label: group.label,
      category,
      implemented: implementedCount,
      inert: inertCount,
      stub: stubCount,
      total: functions.length,
      percent: functions.length > 0 ? Math.round((implementedCount / functions.length) * 1000) / 10 : 0,
      sharedSources: group.shared_sources || null,
    });
  }

  // Sort index alphabetically by name
  indexEntries.sort((a, b) => a.name.localeCompare(b.name));

  const totalImplemented = indexEntries.reduce((acc, curr) => acc + curr.implemented, 0);
  const totalInert = indexEntries.reduce((acc, curr) => acc + curr.inert, 0);
  const totalStub = indexEntries.reduce((acc, curr) => acc + curr.stub, 0);
  const totalFunctions = indexEntries.reduce((acc, curr) => acc + curr.total, 0);

  const libraryIndex = {
    commit: commitInfo,
    summary: {
      libraryCount: indexEntries.length,
      implemented: totalImplemented,
      inert: totalInert,
      stub: totalStub,
      total: totalFunctions,
      percent: totalFunctions > 0 ? Math.round(((totalImplemented + totalInert) / totalFunctions) * 10000) / 100 : 0,
    },
    shaders: progressData.shaders || null,
    libraries: indexEntries,
  };

  fs.writeFileSync(LIBRARIES_INDEX, JSON.stringify(libraryIndex, null, 2) + '\n', 'utf-8');
  console.log(`Generated ${indexEntries.length} library data files and index at ${LIBRARIES_INDEX}`);
}

generate();
