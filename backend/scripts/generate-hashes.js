/**
 * Script per generare hash bcrypt per il seed del database
 * Esegui con: node scripts/generate-hashes.js
 */

import bcrypt from 'bcrypt';

const passwords = {
  admin: 'Admin123!',
  user: 'User123!',
  marca: 'Marca123!'
};

const SALT_ROUNDS = 10;

async function generateHashes() {
  console.log('='.repeat(50));
  console.log('HASH BCRYPT PER SEED DATABASE');
  console.log('='.repeat(50));

  for (const [role, password] of Object.entries(passwords)) {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    console.log(`\n${role.toUpperCase()}:`);
    console.log(`  Password: ${password}`);
    console.log(`  Hash: ${hash}`);
  }

  console.log('\n' + '='.repeat(50));
}

generateHashes();
