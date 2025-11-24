const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');
const path = require('path');

async function startDevDatabase() {
  console.log('🚀 Starting development MongoDB server...\n');
  
  try {
    // Create MongoDB Memory Server instance
    const mongod = await MongoMemoryServer.create({
      instance: {
        port: 27017, // Use default MongoDB port
        dbName: 'tasknest',
      },
    });

    const uri = mongod.getUri();
    console.log('✅ Development MongoDB server started successfully!');
    console.log('📍 Connection URI:', uri);
    console.log('🔌 Port: 27017');
    console.log('📊 Database: tasknest\n');

    // Update .env file with the connection string
    const envPath = path.join(__dirname, '..', '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Replace MongoDB URI
    const newUri = 'mongodb://localhost:27017/tasknest';
    envContent = envContent.replace(
      /MONGODB_URI=.*/,
      `MONGODB_URI=${newUri}`
    );
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Updated .env file with connection string\n');

    console.log('🎉 MongoDB is ready! You can now:');
    console.log('   1. Start the backend: npm start');
    console.log('   2. Register users and create tasks\n');
    
    console.log('⚠️  Note: This is an in-memory database for development');
    console.log('   Data will be lost when this process stops\n');
    
    console.log('Press Ctrl+C to stop the database server');

    // Keep the process running
    process.on('SIGINT', async () => {
      console.log('\n\n🛑 Stopping development MongoDB server...');
      await mongod.stop();
      console.log('✅ MongoDB server stopped');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Failed to start development MongoDB server:', error);
    process.exit(1);
  }
}

startDevDatabase();
