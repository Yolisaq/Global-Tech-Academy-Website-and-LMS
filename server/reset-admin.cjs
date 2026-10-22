
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function main() {
  const readline = require('readline');

  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error('Please run this script directly in the VS Code terminal.');
  }

  const password = await new Promise((resolve, reject) => {
    const input = process.stdin;
    let value = '';

    process.stdout.write('Enter your new admin password (12+ characters): ');
    input.setRawMode(true);
    input.resume();

    function onData(key) {
      if (key.toString() === '\u0003') {
        input.setRawMode(false);
        input.removeListener('data', onData);
        process.stdout.write('\nCancelled.\n');
        reject(new Error('Reset cancelled.'));
        return;
      }

      if (key.toString() === '\r' || key.toString() === '\n') {
        input.setRawMode(false);
        input.removeListener('data', onData);
        process.stdout.write('\n');
        resolve(value);
        return;
      }

      if (key.toString() === '\u007f' || key.toString() === '\b') {
        value = value.slice(0, -1);
      } else {
        value += key.toString();
      }
    }

    input.on('data', onData);
  });

  if (password.length < 12) {
    throw new Error('Password must contain at least 12 characters.');
  }

  const dbPath = path.join(__dirname, 'data', 'db.json');
  const backupPath = path.join(__dirname, 'data', 'db.backup.json');

  if (!fs.existsSync(dbPath)) {
    throw new Error('Database not found: ' + dbPath);
  }

  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(dbPath, backupPath);
  }

  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const admin = db.users.find(
    user => user.email.trim().toLowerCase() ===
      'admin@globaltechacademy.co.za'
  );

  if (!admin) {
    throw new Error('Admin account was not found.');
  }

  admin.passwordHash = await bcrypt.hash(password, 12);
  admin.role = 'admin';
  admin.status = 'active';

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2) + '\n');

  console.log('Admin password reset successfully.');
  console.log('Admin role: admin');
  console.log('Admin status: active');
  console.log('Backup saved to data/db.backup.json');
}

main().catch(error => {
  console.error('Reset failed:', error.message);
  process.exitCode = 1;
});
