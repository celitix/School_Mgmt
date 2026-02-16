import { randomBytes } from 'crypto';

// Generates a 64-character hex string
const token = randomBytes(32).toString('hex');
console.log(token); // e.g., 'f1d2...a3b4'
