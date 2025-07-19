import { PrismaClient } from '@/lib/generated/prisma';
import { NextResponse, NextRequest } from 'next/server';

const prisma = new PrismaClient();

// adding new book
export async function POST(request: NextRequest) {
  try {
    const { title, bookId } = await request.json();
    if (!title || !bookId) {
      return NextResponse.json({ error: 'Title and Book ID are required' }, { status: 400 });
    }

    const newBook = await prisma.book.create({
      data: {
        title,
        bookId,
      },
    });

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error('Error adding book:', error);
    return NextResponse.json({ error: 'Failed to add book' }, { status: 500 });
  }
}

// fetching all books
export async function GET() {
  try {
    const books = await prisma.book.findMany();
    return NextResponse.json(books, { status: 200 });
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
  }
}

// editing a book
export async function PUT(request: NextRequest) {
  try {
    const { bookId, title } = await request.json();
    if (!bookId || !title) {
      return NextResponse.json({ error: 'Book ID and Title are required' }, { status: 400 });
    }

    const updatedBook = await prisma.book.update({
      where: { bookId },
      data: { title, bookId },
    });

    return NextResponse.json(updatedBook, { status: 200 });
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
  }
}

//deleting a book

export async function DELETE(request: NextRequest) {
  try {
    const { bookId } = await request.json();
    if (!bookId) {
      return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
    }

    await prisma.book.delete({
      where: { bookId },
    });

    return NextResponse.json({ message: 'Book deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 });
  }
}
