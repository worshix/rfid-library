#!/usr/bin/env node

// Test script to simulate RFID scans
// Usage: node scripts/test-rfid.mjs <rfidTag> <position>

const rfidTag = process.argv[2] || 'RFID001';
const position = process.argv[3] || 'desk';

const testData = {
  rfidTag,
  position
};

console.log(`🏷️  Testing RFID scan: ${rfidTag} at ${position}`);

fetch('http://localhost:3000/api/microcontroller', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData)
})
.then(response => response.json())
.then(data => {
  console.log('✅ Response:', data);
})
.catch(error => {
  console.error('❌ Error:', error);
  console.log('Make sure your Next.js server is running on http://localhost:3000');
});

console.log('\n📖 Available test books:');
console.log('RFID001 - The Great Gatsby');
console.log('RFID002 - To Kill a Mockingbird');  
console.log('RFID003 - 1984');
console.log('RFID004 - Pride and Prejudice');
console.log('RFID005 - The Catcher in the Rye');
console.log('\n📍 Available positions: desk, door');
console.log('\n💡 Usage examples:');
console.log('node scripts/test-rfid.mjs RFID001 desk   # Borrow/Return book');
console.log('node scripts/test-rfid.mjs RFID001 door   # Theft detection');
