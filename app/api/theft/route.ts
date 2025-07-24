import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const theftAlerts = await prisma.theftAlert.findMany({
      include: {
        book: true,
      },
    });

    return NextResponse.json(theftAlerts);
  } catch (error) {
    console.error("Error fetching borrowings:", error);
    return NextResponse.json({ error: "Failed to fetch borrowings" }, { status: 500 });
  }
}

//handle deleting all alerts
export async function DELETE(request: NextRequest) {
  try {
    await prisma.theftAlert.deleteMany();
    return NextResponse.json({ message: "All alerts cleared" });
  } catch (error) {
    console.error("Error clearing alerts:", error);
    return NextResponse.json({ error: "Failed to clear alerts" }, { status: 500 });
  }
}