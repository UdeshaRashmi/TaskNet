#!/usr/bin/env node

const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('../config/database');
const User = require('../models/User');
const Category = require('../models/Category');

const setupDatabase = async () => {
  try {
    console.log('🚀 Setting up TaskNest database...\n');
    
    // Connect to database
    await connectDB();
    
    // Check if database is empty
    const userCount = await User.countDocuments();
    const categoryCount = await Category.countDocuments();
    
    if (userCount === 0 && categoryCount === 0) {
      console.log('📝 Database is empty. You can now start creating users and tasks!');
    } else {
      console.log(`👥 Found ${userCount} users and ${categoryCount} categories in database`);
    }
    
    // Display connection info
    const connection = mongoose.connection;
    console.log('\n📊 Database Information:');
    console.log(`   Host: ${connection.host}`);
    console.log(`   Port: ${connection.port}`);
    console.log(`   Database: ${connection.name}`);
    console.log(`   Collections: ${Object.keys(connection.collections).join(', ') || 'None'}`);
    
    console.log('\n✅ Database setup complete!');
    console.log('💡 You can now start your server with: npm run dev');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('   1. Make sure MongoDB is running on your system');
    console.log('   2. Check your MONGODB_URI in the .env file');
    console.log('   3. For local MongoDB: mongodb://localhost:27017/tasknest');
    console.log('   4. For MongoDB Atlas: Check your connection string');
    process.exit(1);
  }
};

// Run setup if called directly
if (require.main === module) {
  setupDatabase().then(() => {
    mongoose.connection.close();
    process.exit(0);
  });
}

module.exports = setupDatabase;

