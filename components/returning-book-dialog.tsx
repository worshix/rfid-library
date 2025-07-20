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

interface ReturningBookDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bookId: string
  bookTitle: string
  studentId: string
}

export function ReturningBookDialog({ open, onOpenChange, bookId, bookTitle, studentId }: ReturningBookDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/borrowings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId,
          studentId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        console.log("Book returned successfully:", data)
        onOpenChange(false)
      } else {
        setError(data.error || "Failed to return book")
      }
    } catch (err) {
      console.error("Error returning book:", err)
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = (open: boolean) => {
    if (!isLoading) {
      if (!open) {
        setError("")
      }
      onOpenChange(open)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Return Book</DialogTitle>
          <DialogDescription>Confirm the return of this book.</DialogDescription>
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
            <Input id="studentId" value={studentId} className="col-span-3" disabled />
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
            disabled={isLoading}
          >
            {isLoading ? "Returning..." : "Return Book"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
