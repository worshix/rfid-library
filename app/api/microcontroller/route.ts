// Micro controller makes request with the rfid tag
// When request is made, a dialog box shows up on the screen
import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import { broadcastToClients, RFIDEvent } from "@/lib/websocket-broadcast";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const { rfidTag, position } = await request.json();
  
  console.log(`RFID scan detected: ${rfidTag} at ${position}`);

  try {
    // Find the book by RFID tag (assuming rfidTag is the bookId)
    const book = await prisma.book.findUnique({
      where: { bookId: rfidTag }
    });

    if (!book) {
      return NextResponse.json(
        { error: "Book not found" }, 
        { status: 404 }
      );
    }

    let event: RFIDEvent;

    if (position === 'desk') {
      // At desk: Check if book is available for borrowing or needs to be returned
      const activeBorrowing = await prisma.borrowing.findFirst({
        where: {
          bookId: rfidTag,
          status: 'active'
        }
      });

      if (activeBorrowing) {
        // Book is currently borrowed - show return dialog
        event = {
          type: 'returning',
          data: {
            bookId: book.bookId,
            bookTitle: book.title,
            studentId: activeBorrowing.studentId,
            position: position,
            timestamp: new Date().toISOString()
          }
        };
      } else {
        // Book is available - show borrow dialog
        event = {
          type: 'borrowing',
          data: {
            bookId: book.bookId,
            bookTitle: book.title,
            position: position,
            timestamp: new Date().toISOString()
          }
        };
      }
    } else if (position === 'door') {
      // At door: Check if book is being stolen
      const activeBorrowing = await prisma.borrowing.findFirst({
        where: {
          bookId: rfidTag,
          status: 'active'
        }
      });

      if (!activeBorrowing) {
        // Book is not borrowed but detected at door - theft alert!
        // Create theft alert record
        await prisma.theftAlert.create({
          data: {
            bookId: book.bookId,
            timeStolen: new Date()
          }
        });

        event = {
          type: 'theft',
          data: {
            bookId: book.bookId,
            bookTitle: book.title,
            position: position,
            timestamp: new Date().toISOString()
          }
        };

        // Send response with message of theft back to controller
        return NextResponse.json({
          message: `Theft alert! Book ${rfidTag} detected at door`,
          action: 'theft',
          book: book.title
        });
      } else {
        // Book is properly borrowed - no action needed
        return NextResponse.json({
          message: `Book ${rfidTag} is properly borrowed by ${activeBorrowing.studentId}`,
          action: 'none'
        });
      }
    } else {
      return NextResponse.json(
        { error: "Invalid position. Must be 'desk' or 'door'" },
        { status: 400 }
      );
    }

    // Broadcast the event to all connected WebSocket clients
    broadcastToClients(event);

    return NextResponse.json({
      message: `RFID tag ${rfidTag} processed successfully`,
      action: event.type,
      book: book.title
    });

  } catch (error) {
    console.error("Error processing RFID scan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}