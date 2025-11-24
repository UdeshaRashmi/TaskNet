const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    console.log('🔍 Testing MongoDB connection...');
    console.log('📍 Connection URI:', process.env.MONGODB_URI?.replace(/\/\/.*:.*@/, '//***:***@') || 'Not set');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tasknest', {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('\n✅ MongoDB Connection Successful!');
    console.log('📊 Database:', conn.connection.name);
    console.log('🌐 Host:', conn.connection.host);
    console.log('🔌 Port:', conn.connection.port || 'N/A (Atlas)');
    console.log('📁 Collections:', (await conn.connection.db.listCollections().toArray()).map(c => c.name).join(', ') || 'None (new database)');
    
    console.log('\n✨ Your backend is ready to use!');
    console.log('👉 You can now register users and create tasks.\n');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ MongoDB Connection Failed!');
    console.error('📋 Error:', error.message);
    
    if (error.message.includes('authentication')) {
      console.log('\n💡 Solution: Check your username and password in the connection string');
    } else if (error.message.includes('timed out')) {
      console.log('\n💡 Solutions:');
      console.log('   1. Make sure MongoDB is running (if using local)');
      console.log('   2. Check your internet connection (if using Atlas)');
      console.log('   3. Verify IP whitelist in Atlas Network Access');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Solution: MongoDB is not running. Start it with: net start MongoDB');
    }
    
    process.exit(1);
  }
};

testConnection();
