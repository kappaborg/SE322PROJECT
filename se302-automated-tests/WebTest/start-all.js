const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting WebTest Dashboard...\n');

// Start server
console.log('📡 Starting backend server...');
const server = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'server'),
  shell: true,
  stdio: 'inherit'
});

// Wait a bit for server to start, then start client
setTimeout(() => {
  console.log('🎨 Starting frontend client...');
  const client = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'client'),
    shell: true,
    stdio: 'inherit'
  });

  client.on('error', (error) => {
    console.error('Client error:', error);
  });
}, 2000);

server.on('error', (error) => {
  console.error('Server error:', error);
});

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down...');
  server.kill();
  process.exit();
});

