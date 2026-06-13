
const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const root = __dirname;
const buildDir = 'C:\\Temp\\library-management-next';
const nodeModules = path.join(root, 'node_modules');
const dotNext = path.join(root, '.next');

// Ensure build dir exists
fs.mkdirSync(buildDir, { recursive: true });

// Remove junction only (rmdir without /s), then recreate
try {
  execSync(`rmdir "${dotNext}"`, { shell: 'cmd', stdio: 'ignore' });
} catch (e) {}
if (fs.existsSync(dotNext)) {
  execSync(`rd /s /q "${dotNext}"`, { shell: 'cmd', stdio: 'ignore' });
}

// Create .next junction pointing to C:\Temp\library-management-next
execSync(`mklink /J "${dotNext}" "${buildDir}"`, { shell: 'cmd', stdio: 'inherit' });

// Start Next.js dev with NODE_PATH so compiled bundles resolve packages
const nextBin = path.join(nodeModules, 'next', 'dist', 'bin', 'next');
const child = spawn(process.execPath, [nextBin, 'dev'], {
  env: { ...process.env, NODE_PATH: nodeModules },
  cwd: root,
  stdio: 'inherit',
});

child.on('exit', (code) => process.exit(code || 0));
process.on('SIGINT', () => child.kill('SIGINT'));
process.on('SIGTERM', () => child.kill('SIGTERM'));
