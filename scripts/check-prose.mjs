import fs from 'node:fs';
import path from 'node:path';

const DOCS_DIR = path.resolve('src/content/docs');

const BANNED_WORDS = [
  'delve', 'delves', 'delving', 'delved',
  'tapestry',
  'intricate', 'intricacies',
  'pivotal',
  'crucial',
  'vibrant',
  'foster', 'fosters', 'fostering',
  'garner', 'garners', 'garnering',
  'showcase', 'showcases', 'showcasing',
  'leverage', 'leverages', 'leveraging',
  'utilize', 'utilizes', 'utilizing', 'utilization',
  'comprehensive',
  'streamline', 'streamlines', 'streamlining',
  'meticulous', 'meticulously',
  'realm',
  'embark', 'embarks', 'embarking',
  'unlock', 'unlocks', 'unlocking', // Note: game trophy unlock is handled via allow-patterns or ignore comments
  'elevate', 'elevates', 'elevating',
  'empower', 'empowers', 'empowering',
  'journey',
  'interplay',
  'align with', 'aligns with',
];

const BANNED_PHRASES = [
  'testament to',
  'vital role',
  'pivotal moment',
  'highlights the importance',
  'underscores',
  'reflects broader trends',
  'stands as',
  'ensuring seamless',
  'highlighting its',
  'robust',
  'seamless',
  'cutting-edge',
  'game-changing',
  'boasts',
  'important to note',
  'worth mentioning',
  'keep in mind that',
  'experts say',
  'many users report',
  'widely believed',
  'in summary',
  'in conclusion',
  'not just',
  'from beginners to experts',
  'serves as',
  'functions as',
  'additionally,',
  'moreover,',
  'furthermore,',
  'certainly!',
  'here is the',
  'i hope this helps',
  'let me know if',
  '[your name]',
  'utm_source',
  'contentreference',
  'oaicite',
];

const PROPER_NOUNS = new Set([
  'PS5', 'PlayStation', 'Sony', 'Linux', 'Windows', 'macOS', 'Apple', 'Intel',
  'AMD', 'Zen', 'ELF', 'SELF', 'PRX', 'NID', 'Vulkan', 'SPIR-V', 'RDNA2',
  'CPU', 'GPU', 'RAM', 'VRAM', 'HDR', 'SDR', 'POSIX', 'Win32', 'DirectX',
  'DXGI', 'D3D12', 'SDL', 'SDL2', 'FFmpeg', 'FreeType', 'ZArchive', 'CMake',
  'MSYS2', 'UCRT64', 'MinGW', 'GCC', 'Clang', 'CI', 'API', 'ABI', 'ASLR',
  'PLT', 'GOT', 'AVX2', 'FMA', 'BMI1', 'BMI2', 'LZCNT', 'MOVBE', 'Wayland',
  'X11', 'XRandR', 'ALSA', 'PipeWire', 'PulseAudio', 'JSON', 'TOML', 'CLI',
  'GitHub', 'Git', 'Discord', 'FAQ', 'URI', 'URL', 'ID', 'IDs', 'Node', 'NPM',
  'PNG', 'JPEG', 'OpenXR', 'VR', 'Dozen', 'Mesa', 'BT.2100', 'PQ', 'HDR10',
  'RDNA', 'ISA', 'GPL', 'GPL-2.0', 'SIL', 'LLVM', 'ACO', 'C++', 'Python', 'WASM',
  'WebAssembly', 'Emscripten', 'AnyPS5', 'AnyWiki', 'Starlight', 'Astro',
  'Task', 'Manager', 'Explorer', 'Settings', 'Display', 'Game', 'New',
  'Cross', 'Circle', 'Square', 'Triangle', 'Options', 'TouchLeft', 'TouchRight'
]);

const EMOJI_REGEX = /\p{Extended_Pictographic}/u;

function isTitleCaseHeading(line) {
  const match = line.match(/^#{1,6}\s+(.+)$/);
  if (!match) return false;
  const headingText = match[1].trim();
  // Strip markdown links/code
  const clean = headingText.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/`[^`]+`/g, '');
  const words = clean.split(/\s+/).filter(w => /^[A-Za-z]+$/.test(w));
  if (words.length <= 1) return false;

  let capitalizedCount = 0;
  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    if (PROPER_NOUNS.has(word)) continue;
    if (word[0] === word[0].toUpperCase() && word[0] !== word[0].toLowerCase()) {
      capitalizedCount++;
    }
  }
  return capitalizedCount >= 2;
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/);
  const errors = [];

  let inCodeBlock = false;
  let inFrontmatter = false;
  let frontmatterCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const line = lines[i];

    if (line.trim() === '---') {
      frontmatterCount++;
      inFrontmatter = frontmatterCount === 1;
      continue;
    }
    if (inFrontmatter) {
      if (frontmatterCount >= 2) inFrontmatter = false;
      else continue;
    }

    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    // Check per-line escape
    if (line.includes('prose-ignore') || line.includes('<!-- prose-ignore -->')) {
      continue;
    }

    // Check em-dash
    if (line.includes('—') || line.includes('&mdash;')) {
      errors.push(`Line ${lineNum}: Em dash found. Use comma, period, or parentheses.`);
    }

    // Check emojis
    if (EMOJI_REGEX.test(line)) {
      errors.push(`Line ${lineNum}: Emoji found.`);
    }

    // Check Title Case heading
    if (line.startsWith('#')) {
      if (isTitleCaseHeading(line)) {
        errors.push(`Line ${lineNum}: Heading appears to use Title Case instead of sentence case: "${line}"`);
      }
    }

    // Check banned phrases
    const lower = line.toLowerCase();
    for (const phrase of BANNED_PHRASES) {
      if (lower.includes(phrase)) {
        // Special allowance for trophy unlock mentions if phrased as code/literal
        if (phrase.includes('unlock') && (lower.includes('_unlocktrophy') || lower.includes('trophy'))) {
          continue;
        }
        errors.push(`Line ${lineNum}: Banned phrase "${phrase}"`);
      }
    }

    // Check banned words
    for (const word of BANNED_WORDS) {
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      if (regex.test(line)) {
        if (word.startsWith('unlock') && (lower.includes('_unlocktrophy') || lower.includes('trophy'))) {
          continue;
        }
        errors.push(`Line ${lineNum}: Banned word "${word}"`);
      }
    }
  }

  return errors;
}

function walk(dir) {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(walk(full));
    } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
      files.push(full);
    }
  }
  return files;
}

const allFiles = walk(DOCS_DIR);
let totalErrors = 0;

for (const file of allFiles) {
  const rel = path.relative(process.cwd(), file);
  const errors = checkFile(file);
  if (errors.length > 0) {
    console.error(`\x1b[31m[PROSE ERROR]\x1b[0m ${rel}:`);
    for (const err of errors) {
      console.error(`  ${err}`);
    }
    totalErrors += errors.length;
  }
}

if (totalErrors > 0) {
  console.error(`\n\x1b[31mProse check failed with ${totalErrors} issue(s).\x1b[0m`);
  process.exit(1);
} else {
  console.log(`\x1b[32mProse check passed across ${allFiles.length} file(s).\x1b[0m`);
}
