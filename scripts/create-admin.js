#!/usr/bin/env node

/**
 * Create Admin Account Script
 * 
 * This script helps you create the first admin account for the website.
 * 
 * Usage:
 *   node scripts/create-admin.js
 *   node scripts/create-admin.js --email admin@example.com --password SecurePass123! --name "Admin Name"
 * 
 * Or set environment variables:
 *   ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=SecurePass123! ADMIN_NAME="Admin Name" node scripts/create-admin.js
 */

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get command line arguments or environment variables
const args = process.argv.slice(2);
const getArg = (flag) => {
  const index = args.indexOf(flag);
  if (index !== -1 && args[index + 1]) {
    return args[index + 1];
  }
  return null;
};

const email = getArg('--email') || process.env.ADMIN_EMAIL || 'admin@daddyjobe.edu.gm';
const password = getArg('--password') || process.env.ADMIN_PASSWORD || 'Admin123!@#';
const name = getArg('--name') || process.env.ADMIN_NAME || 'Administrator';

async function createAdmin() {
  try {
    console.log('🔐 Creating admin account...\n');

    // Check if any admin already exists
    const adminCount = await prisma.admin.count();
    if (adminCount > 0) {
      console.log('❌ Admin account already exists!');
      console.log('   Use the login endpoint instead: /api/auth/login');
      console.log('   Or reset the database: npx prisma migrate reset');
      process.exit(1);
    }

    // Validate inputs
    if (!email || !email.includes('@')) {
      console.log('❌ Invalid email address');
      process.exit(1);
    }

    if (!password || password.length < 8) {
      console.log('❌ Password must be at least 8 characters');
      process.exit(1);
    }

    if (!name || name.length < 2) {
      console.log('❌ Name must be at least 2 characters');
      process.exit(1);
    }

    // Check if email already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingAdmin) {
      console.log('❌ An admin with this email already exists');
      process.exit(1);
    }

    // Hash password
    console.log('🔒 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin
    console.log('👤 Creating admin user...');
    const admin = await prisma.admin.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        role: 'super_admin', // First admin is super_admin
      },
    });

    console.log('\n✅ Admin account created successfully!\n');
    console.log('📋 Account Details:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Name: ${admin.name}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   ID: ${admin.id}\n`);
    console.log('🔑 Login Credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}\n`);
    console.log('⚠️  IMPORTANT: Save these credentials in a secure location!');
    console.log('⚠️  Change the password after first login in production!\n');
    console.log('🌐 Next Steps:');
    console.log('   1. Navigate to: http://localhost:3000/admin/login');
    console.log('   2. Enter your email and password');
    console.log('   3. Click "Sign In"\n');

  } catch (error) {
    console.error('\n❌ Error creating admin account:');
    console.error(error.message);
    if (error.code === 'P2002') {
      console.error('\n   This email already exists. Please use a different email.');
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createAdmin();

