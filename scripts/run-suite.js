const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const suite = process.argv[2] || 'all';
const outputDirMap = {
  smoke: 'smoke-report',
  regression: 'regression-report',
  auth: 'auth-report',
  critical: 'critical-report',
  users: 'users-report',
};

const tagMap = {
  smoke: '@smoke',
  regression: '@regression',
  auth: '@auth',
  critical: '@critical',
  users: '@users',
};

const outputDir = outputDirMap[suite] || 'playwright-report';
const tag = tagMap[suite];

fs.mkdirSync(path.join(process.cwd(), outputDir), { recursive: true });

const command = ['playwright', 'test', '--reporter=list,html'];
if (tag) {
  command.push('--grep', tag);
}
command.push('--output', outputDir);

const env = { ...process.env, PLAYWRIGHT_HTML_OUTPUT_DIR: outputDir };
const result = spawnSync(command[0], command.slice(1), { stdio: 'inherit', shell: true, env });

if (result.status !== 0) {
  process.exit(result.status || 1);
}
