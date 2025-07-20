import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const borrowings = await prisma.borrowing.findMany({
      include: {
        book: true,
      },
    });

    return NextResponse.json(borrowings);
  } catch (error) {
    console.error("Error fetching borrowings:", error);
    return NextResponse.json({ error: "Failed to fetch borrowings" }, { status: 500 });
  }
}