"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {useState, useEffect} from "react"
import axios from "axios"

export default function BorrowingsPage() {
  const [borrowings, setBorrowings] = useState([]);
  
  useEffect(() => {
    const fetchBorrowings = async () => {
      try {
        const response = await axios.get("/api/borrowings");
        setBorrowings(response.data);
      } catch (error) {
        console.error("Error fetching borrowings:", error);
      }
    };
    fetchBorrowings();
  }, []);

  // Function to calculate late fine
  const calculateLateFine = (dueDate: string, status: string) => {
    if (status === "returned") return 0;
    
    const currentDate = new Date();
    const due = new Date(dueDate);
    const diffTime = currentDate.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays * 1 : 0; // $1 per day late
  };

  // Function to format date to human readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Function to determine status based on due date
  const getStatus = (dueDate: string, returnedAt: string | null) => {
    if (returnedAt) return "returned";
    
    const currentDate = new Date();
    const due = new Date(dueDate);
    
    return currentDate > due ? "late" : "active";
  };

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
                {borrowings.map((borrowing) => {
                  const status = getStatus(borrowing.dueDate, borrowing.returnedAt);
                  const lateFine = calculateLateFine(borrowing.dueDate, status);
                  
                  return (
                    <TableRow key={borrowing.id}>
                      <TableCell className="font-medium">{borrowing.bookId}</TableCell>
                      <TableCell>{borrowing.book.title}</TableCell>
                      <TableCell>{borrowing.studentId}</TableCell>
                      <TableCell>{formatDate(borrowing.borrowedAt)}</TableCell>
                      <TableCell>{formatDate(borrowing.dueDate)}</TableCell>
                      <TableCell>
                        <Badge variant={status === "late" ? "destructive" : status === "active" ? "secondary" : "default"}>
                          {status === "late" ? "Late" : status === "active" ? "Active" : "Returned"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {lateFine > 0 ? (
                          <span className="text-red-600 font-medium">${lateFine.toFixed(2)}</span>
                        ) : (
                          <span className="text-green-600">$0.00</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
