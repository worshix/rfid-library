import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  const borrowings = await prisma.borrowing.findMany({
    include: {
      book: {
        select: {
          title: true,
        },
      },
    },
  });
  console.log("Fetched borrowings:", borrowings);
  return NextResponse.json(borrowings);
}

// In your API route or service function
export async function POST (request : NextRequest) {
  const { bookId, studentId } = await request.json();
  const borrowedAt = new Date();
  const dueDate = new Date(borrowedAt);
  dueDate.setDate(dueDate.getDate() + 14); // Add 14 days
  try{
    // Start a transaction to ensure data consistency
    const result = await prisma.$transaction(async (prisma) => {
      // Check if book is available
      const book = await prisma.book.findUnique({
        where: { bookId }
      });
      
      if (!book || !book.isAvailable) {
        throw new Error("Book is not available");
      }

      // Create borrowing record
      const borrowing = await prisma.borrowing.create({
        data: {
          bookId,
          studentId,
          borrowedAt,
          dueDate, // Explicitly set due date
          status: 'active'
        }
      });

      // Update book availability
      await prisma.book.update({
        where: { bookId },
        data: { isAvailable: false }
      });

      return borrowing;
    });

    return NextResponse.json({ 
      message: "Book borrowed successfully",
      borrowing: result 
    }, { status: 201 });
  }
  catch (error) {
    console.error("Error borrowing book:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to borrow book" 
    }, { status: 500 });
  }
};

// Handle book returns
export async function PATCH(request: NextRequest) {
  const { bookId, studentId } = await request.json();
  
  try {
    const result = await prisma.$transaction(async (prisma) => {
      // Find the active borrowing
      const borrowing = await prisma.borrowing.findFirst({
        where: {
          bookId,
          studentId,
          status: 'active'
        }
      });

      if (!borrowing) {
        throw new Error("No active borrowing found for this book and student");
      }

      // Update borrowing status
      const updatedBorrowing = await prisma.borrowing.update({
        where: { id: borrowing.id },
        data: { 
          status: 'returned',
          returnedAt: new Date()
        }
      });

      // Update book availability
      await prisma.book.update({
        where: { bookId },
        data: { isAvailable: true }
      });

      return updatedBorrowing;
    });

    return NextResponse.json({ 
      message: "Book returned successfully",
      borrowing: result 
    }, { status: 200 });
  }
  catch (error) {
    console.error("Error returning book:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to return book" 
    }, { status: 500 });
  }
}

// when returning book
export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  try {
    const borrowing = await prisma.borrowing.delete({
      where: { id },
    });
    if (!borrowing) {
      return NextResponse.json({ error: "Borrowing deletion failed" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error deleting borrowing:", error);
    return NextResponse.json({ error: "Failed to delete borrowing" }, { status: 500 });
  }
  return NextResponse.json({ message: "Borrowing deleted successfully" }, { status: 200 });
}
export async function PUT(request: NextRequest) {
  const { id, status } = await request.json();
  try {
    const borrowing = await prisma.borrowing.update({
      where: { id },
      data: { status },
    });
    if (!borrowing) {
      return NextResponse.json({ error: "Borrowing update failed" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error updating borrowing:", error);
    return NextResponse.json({ error: "Failed to update borrowing" }, { status: 500 });
  }
  return NextResponse.json({ message: "Borrowing updated successfully" }, { status: 200 });
}