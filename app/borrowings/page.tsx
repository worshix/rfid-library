"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { mockBorrowings } from "@/lib/mock-data"

export default function BorrowingsPage() {
  return (
    <SidebarInset className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-xl font-semibold">Borrowings</h1>
      </header>
      <div className="flex-1 space-y-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Active Borrowings</CardTitle>
            <CardDescription>Track all currently borrowed books and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book ID</TableHead>
                  <TableHead>Book Title</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Borrowed Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Late Fine</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockBorrowings.map((borrowing) => (
                  <TableRow key={borrowing.id}>
                    <TableCell className="font-medium">{borrowing.bookId}</TableCell>
                    <TableCell>{borrowing.bookTitle}</TableCell>
                    <TableCell>{borrowing.studentId}</TableCell>
                    <TableCell>{borrowing.borrowedDate.toLocaleDateString()}</TableCell>
                    <TableCell>{borrowing.dueDate.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={borrowing.status === "late" ? "destructive" : "default"}>
                        {borrowing.status === "late" ? "Late" : "In Time"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {borrowing.lateFine > 0 ? (
                        <span className="text-red-600 font-medium">${borrowing.lateFine.toFixed(2)}</span>
                      ) : (
                        <span className="text-green-600">$0.00</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
