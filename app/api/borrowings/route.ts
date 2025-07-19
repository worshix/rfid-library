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
    const borrowing = await prisma.borrowing.create({
      data: {
        bookId,
        studentId,
        borrowedAt,
        dueDate, // Explicitly set due date
        status: 'active'
      }
    });
    if (!borrowing) {
      return NextResponse.json({ error: "Borrowing creation failed" }, { status: 400 });
    }
  }
  catch (error) {
    console.error("Error borrowing book:", error);
    return NextResponse.json({ error: "Failed to borrow book" }, { status: 500 });
  }
  return NextResponse.json({ message: "Book borrowed successfully" }, { status: 201 });
};