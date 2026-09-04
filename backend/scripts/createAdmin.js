require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');
const User = require('../src/modules/users/models/User');
const { ROLES } = require('../src/shared/constants/constants');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('Error: MONGODB_URI is not defined in your .env file.');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully.\n');

    console.log('--- DeployX Admin Account Creator ---');
    const fullName = (await askQuestion('Enter Full Name (e.g. System Admin): ')) || 'Admin';
    const email = (await askQuestion('Enter Email Address: ')).trim().toLowerCase();
    
    if (!email || !email.includes('@')) {
      console.error('Error: A valid email address is required.');
      process.exit(1);
    }

    const password = await askQuestion('Enter Password (min 8 chars with upper, lower, number, special char): ');
    
    if (!password || password.length < 8) {
      console.error('Error: Password must be at least 8 characters long.');
      process.exit(1);
    }

    let user = await User.findOne({ email }).select('+password');

    if (user) {
      console.log(`\nUser with email ${email} already exists. Upgrading to admin role...`);
      user.role = ROLES.ADMIN;
      user.fullName = fullName || user.fullName;
      user.password = password;
      user.isActive = true;
      await user.save();
      console.log(`Successfully upgraded ${email} to ADMIN with new password!`);
    } else {
      user = await User.create({
        fullName,
        email,
        password,
        role: ROLES.ADMIN,
        isActive: true,
      });
      console.log(`\nSuccessfully created new ADMIN user: ${email}`);
    }

    console.log(`\nYou can now log in at http://localhost:5173/login with:`);
    console.log(`Email: ${email}`);
    console.log(`Role:  admin`);

  } catch (error) {
    console.error('Failed to create admin user:', error.message);
  } finally {
    rl.close();
    await mongoose.disconnect();
    process.exit(0);
  }
}

main();
