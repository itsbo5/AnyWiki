import fs from 'node:fs';
import path from 'node:path';

const UPSTREAM_DIR = process.env.ANYPS5_DIR || 'C:\\Users\\Omar\\Documents\\GitHub\\AnyPS5';
const OUTPUT_FILE = path.resolve('src/data/errors.json');

function walk(dir) {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'build' && entry.name !== '.git' && entry.name !== 'build-win') {
        files = files.concat(walk(full));
      }
    } else if (entry.isFile() && (entry.name.endsWith('.cpp') || entry.name.endsWith('.hpp') || entry.name.endsWith('.h'))) {
      files.push(full);
    }
  }
  return files;
}

function extractErrors() {
  if (!fs.existsSync(UPSTREAM_DIR)) {
    if (fs.existsSync(OUTPUT_FILE)) {
      console.log('Upstream repo not found, using committed errors snapshot.');
      return;
    }
    throw new Error(`Upstream repo not found at ${UPSTREAM_DIR} and no snapshot exists.`);
  }

  const coreDir = path.join(UPSTREAM_DIR, 'core');
  console.log(`Scanning for runtime_error in ${coreDir}...`);
  const files = walk(coreDir);
  const errorMap = new Map();

  const regex = /std::runtime_error\s*\(\s*(?:"([^"\\]*(?:\\.[^"\\]*)*)"|([A-Za-z0-9_]+))/g;

  for (const file of files) {
    const relPath = path.relative(UPSTREAM_DIR, file).replace(/\\/g, '/');
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split(/\r?\n/);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let match;
      regex.lastIndex = 0;
      while ((match = regex.exec(line)) !== null) {
        const rawMsg = match[1] || match[2];
        if (!rawMsg || rawMsg.length < 3) continue;

        // Clean escaped chars
        const msg = rawMsg.replace(/\\"/g, '"').replace(/\\n/g, ' ').trim();
        const lineNum = i + 1;

        let component = 'core';
        if (relPath.includes('core/relinker')) component = 'relinker';
        else if (relPath.includes('core/libs/prx/libkernel')) component = 'libkernel';
        else if (relPath.includes('core/libs/prx/libc')) component = 'libc';
        else if (relPath.includes('core/libs/prx/libSceAgc')) component = 'libSceAgc';
        else if (relPath.includes('core/libs/prx/libSceVideoOut')) component = 'libSceVideoOut';
        else if (relPath.includes('core/libs/prx/libScePad')) component = 'libScePad';
        else if (relPath.includes('core/libs/prx/libSceAudio')) component = 'libSceAudio';
        else if (relPath.includes('core/shader')) component = 'shader';
        else if (relPath.includes('core/libs/prx/')) {
          const m = relPath.match(/core\/libs\/prx\/([^/]+)/);
          if (m) component = m[1];
        }

        if (!errorMap.has(msg)) {
          errorMap.set(msg, {
            message: msg,
            component,
            occurrences: [],
          });
        }
        errorMap.get(msg).occurrences.push({
          file: relPath,
          line: lineNum,
        });
      }
    }
  }

  const results = Array.from(errorMap.values()).sort((a, b) => a.message.localeCompare(b.message));

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2) + '\n', 'utf-8');
  console.log(`Extracted ${results.length} distinct runtime errors to ${OUTPUT_FILE}`);
}

extractErrors();
