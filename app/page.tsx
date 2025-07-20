"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { ConnectionStatus } from "@/components/connection-status"
import { mockBooks, mockBorrowings, mockAlerts } from "@/lib/mock-data"
import { BookOpen, Users, AlertTriangle, Clock } from "lucide-react"

export default function HomePage() {
  const totalBooks = mockBooks.length
  const totalBorrowings = mockBorrowings.length
  const lateBorrowings = mockBorrowings.filter((b) => b.status === "late").length
  const totalAlerts = mockAlerts.length
  const totalLateFines = mockBorrowings.reduce((sum, b) => sum + b.lateFine, 0)

  return (
    <SidebarInset className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-xl font-semibold">Dashboard Overview</h1>
        <div className="ml-auto">
          <ConnectionStatus />
        </div>
      </header>
      <div className="flex-1 space-y-4 p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Books</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBooks}</div>
              <p className="text-xs text-muted-foreground">Books in library</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Borrowings</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBorrowings}</div>
              <p className="text-xs text-muted-foreground">Currently borrowed books</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Late Returns</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{lateBorrowings}</div>
              <p className="text-xs text-muted-foreground">Overdue books</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{totalAlerts}</div>
              <p className="text-xs text-muted-foreground">Theft alerts</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest borrowings and returns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockBorrowings.slice(0, 3).map((borrowing) => (
                  <div key={borrowing.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{borrowing.bookTitle}</p>
                      <p className="text-xs text-muted-foreground">Student: {borrowing.studentId}</p>
                    </div>
                    <div
                      className={`text-xs px-2 py-1 rounded ${
                        borrowing.status === "late" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                      }`}
                    >
                      {borrowing.status}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
              <CardDescription>Late fees and fines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total Late Fees:</span>
                  <span className="text-sm font-medium">${totalLateFines.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Books with Fines:</span>
                  <span className="text-sm font-medium">{lateBorrowings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Average Fine:</span>
                  <span className="text-sm font-medium">
                    ${lateBorrowings > 0 ? (totalLateFines / lateBorrowings).toFixed(2) : "0.00"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  )
}
