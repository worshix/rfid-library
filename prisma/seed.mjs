import { PrismaClient } from '../lib/generated/prisma/index.js';

const prisma = new PrismaClient();

const books = [
  {
    bookId: 'RFID001',
    title: 'The Great Gatsby',
  },
  {
    bookId: 'RFID002', 
    title: 'To Kill a Mockingbird',
  },
  {
    bookId: 'RFID003',
    title: '1984',
  },
  {
    bookId: 'RFID004',
    title: 'Pride and Prejudice',
  },
  {
    bookId: 'RFID005',
    title: 'The Catcher in the Rye',
  }
];

async function main() {
  console.log('🌱 Starting seed...');
  
  // Clear existing data
  await prisma.theftAlert.deleteMany();
  await prisma.borrowing.deleteMany();
  await prisma.book.deleteMany();
  
  // Create books
  for (const book of books) {
    await prisma.book.create({
      data: book
    });
    console.log(`📚 Created book: ${book.title} (${book.bookId})`);
  }
  
  console.log('✅ Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
