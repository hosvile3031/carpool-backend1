#!/usr/bin/env node

console.log('🔍 Verifying backend-only build...');
console.log('📁 Current directory:', process.cwd());
console.log('📦 Package.json main:', require('./package.json').main);
console.log('🚀 Start script:', require('./package.json').scripts.start);

// Check if frontend directory exists (it shouldn't)
const fs = require('fs');
if (fs.existsSync('./frontend')) {
  console.error('❌ Frontend directory found - this should not exist!');
  process.exit(1);
} else {
  console.log('✅ No frontend directory found - backend-only confirmed');
}

// Check if server.js exists
if (fs.existsSync('./server.js')) {
  console.log('✅ Server.js found');
} else {
  console.error('❌ Server.js not found!');
  process.exit(1);
}

console.log('🎉 Build verification passed - ready for backend deployment');
