
const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const root = __dirname;
const buildDir = 'C:\\Temp\\library-management-next';
const nodeModules = path.join(root, 'node_modules');
const dotNext = path.join(root, '.next');

fs.mkdirSync(buildDir, { recursive: true });
   not its contents. If it's a real dir, fall back to rd /s /q.
try {
  execSync(`rmdir "${dotNext}"`, { shell: 'cmd', stdio: 'ignore' });
} catch (e) 
if (fs.existsSync(dotNext)) {

  execSync(`rd /s /q "${dotNext}"`, { shell: 'cmd', stdio: 'ignore' });
}

// 3. Create .next → C:\Temp\library-management-next junction
execSync(`mklink /J "${dotNext}" "${buildDir}"`, { shell: 'cmd', stdio: 'inherit' });

// 4. Spawn next dev with NODE_PATH = project node_modules
//    This lets compiled bundles at C:\Temp\... resolve next/react/etc.
const nextBin = path.join(nodeModules, 'next', 'dist', 'bin', 'next');
const child = spawn(process.execPath, [nextBin, 'dev'], {
  env: { ...process.env, NODE_PATH: nodeModules },
  cwd: root,
  stdio: 'inherit',
});

child.on('exit', (code) => process.exit(code || 0));
process.on('SIGINT', () => child.kill('SIGINT'));
process.on('SIGTERM', () => child.kill('SIGTERM'));
