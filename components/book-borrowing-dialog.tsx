"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface BookBorrowingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bookId: string
  bookTitle: string
}

export function BookBorrowingDialog({ open, onOpenChange, bookId, bookTitle }: BookBorrowingDialogProps) {
  const [studentId, setStudentId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (!studentId.trim()) {
      setError("Student ID is required")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/borrowings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId,
          studentId: studentId.trim(),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        console.log("Book borrowed successfully:", data)
        setStudentId("")
        onOpenChange(false)
      } else {
        setError(data.error || "Failed to borrow book")
      }
    } catch (err) {
      console.error("Error borrowing book:", err)
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = (open: boolean) => {
    if (!isLoading) {
      if (!open) {
        setStudentId("")
        setError("")
      }
      onOpenChange(open)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Borrow Book</DialogTitle>
          <DialogDescription>Enter the student ID to borrow this book.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bookId" className="text-right">
              Book ID
            </Label>
            <Input id="bookId" value={bookId} className="col-span-3" disabled />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bookTitle" className="text-right">
              Title
            </Label>
            <Input id="bookTitle" value={bookTitle} className="col-span-3" disabled />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="studentId" className="text-right">
              Student ID
            </Label>
            <Input
              id="studentId"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="col-span-3"
              placeholder="Enter student ID"
              disabled={isLoading}
            />
          </div>
          {error && (
            <div className="text-sm text-red-600 text-center">
              {error}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={isLoading || !studentId.trim()}
          >
            {isLoading ? "Borrowing..." : "Borrow Book"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
