import { PrismaClient } from '@/lib/generated/prisma';
import { NextResponse, NextRequest } from 'next/server';

const prisma = new PrismaClient();

async function POST(request: NextRequest) {
  try {
    const { title, id } = await request.json();
    if (!title || !id) {
      return NextResponse.json({ error: 'Title and ID are required' }, { status: 400 });
    }

    const newBook = await prisma.book.create({
      data: {
        title,
        bookId:id,
      },
    });

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error('Error adding book:', error);
    return NextResponse.json({ error: 'Failed to add book' }, { status: 500 });
  }
}

export { POST };