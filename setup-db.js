const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if Docker is installed
try {
  execSync('docker --version', { stdio: 'ignore' });
  console.log('✅ Docker is installed');
} catch (error) {
  console.error('❌ Docker is not installed. Please install Docker to continue.');
  process.exit(1);
}

// Check if Docker Compose is installed
try {
  execSync('docker-compose --version', { stdio: 'ignore' });
  console.log('✅ Docker Compose is installed');
} catch (error) {
  console.error('❌ Docker Compose is not installed. Please install Docker Compose to continue.');
  process.exit(1);
}

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  const envContent = `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mcat_tracker?schema=public"`;
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file');
} else {
  console.log('✅ .env file already exists');
}

// Start the database container
try {
  console.log('Starting database container...');
  execSync('docker-compose up -d', { stdio: 'inherit' });
  console.log('✅ Database container started');
} catch (error) {
  console.error('❌ Failed to start database container:', error.message);
  process.exit(1);
}

// Wait a bit for the database to initialize
console.log('⏳ Waiting for database to initialize...');
setTimeout(() => {
  // Run Prisma migrations
  try {
    console.log('Running database migrations...');
    execSync('yarn prisma:migrate', { stdio: 'inherit' });
    console.log('✅ Database migrations completed');
    
    // Generate Prisma client
    console.log('Generating Prisma client...');
    execSync('yarn prisma:generate', { stdio: 'inherit' });
    console.log('✅ Prisma client generated');
    
    console.log('\n🎉 Database setup complete! You can now run:');
    console.log('  yarn dev');
    console.log('to start the development server.');
  } catch (error) {
    console.error('❌ Failed to set up the database:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Make sure PostgreSQL container is running:');
    console.log('   docker ps | grep mcat-tracker-db');
    console.log('2. Check if the database is accessible:');
    console.log('   docker exec -it mcat-tracker-db psql -U postgres -d mcat_tracker');
    console.log('3. Check your .env file contains the correct connection string');
    process.exit(1);
  }
}, 5000); 