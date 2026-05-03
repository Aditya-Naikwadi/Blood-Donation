const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function checkPrerequisites() {
  console.log('🔍 Checking prerequisites...');
  try {
    execSync('docker --version');
    execSync('node --version');
    execSync('go version');
    console.log('✅ All prerequisites met.');
  } catch (err) {
    console.error('❌ Missing prerequisites. Please install Docker, Node.js, and Go.');
    process.exit(1);
  }
}

function setupEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  const examplePath = path.join(__dirname, '..', '.env.example');

  if (!fs.existsSync(envPath)) {
    console.log('📄 Creating .env from .env.example...');
    fs.copyFileSync(examplePath, envPath);
    console.log('⚠️ Please update .env with your specific credentials.');
  }
}

function startServices() {
  console.log('🚀 Starting services via Docker Compose...');
  try {
    execSync('docker-compose up -d --build', { stdio: 'inherit' });
    console.log('✅ Services started.');
  } catch (err) {
    console.error('❌ Failed to start services.');
    process.exit(1);
  }
}

async function run() {
  checkPrerequisites();
  setupEnv();
  startServices();
  
  console.log('\n--- Service URLs ---');
  console.log('Web App:      http://localhost:3000');
  console.log('Admin App:    http://localhost:3005');
  console.log('Auth API:     http://localhost:3001');
  console.log('Donor API:    http://localhost:3002');
  console.log('--------------------\n');
}

run();
