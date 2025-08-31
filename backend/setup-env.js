const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up environment configuration...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists');
} else {
  // Create .env file with default values
  const envContent = `# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=attendance_system
DB_USER=root
DB_PASSWORD=

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=5000
NODE_ENV=development
`;

  try {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env file with default configuration');
    console.log('⚠️  Please update the database credentials in .env file');
  } catch (error) {
    console.error('❌ Failed to create .env file:', error.message);
  }
}

console.log('\n📋 Next steps:');
console.log('1. Update database credentials in .env file');
console.log('2. Make sure MySQL is running');
console.log('3. Create database "attendance_system" if it doesn\'t exist');
console.log('4. Run: npm run dev');
console.log('\n💡 You can also run the database setup scripts:');
console.log('   - node setup_database_simplified.js');
console.log('   - node seed/seed.js');
