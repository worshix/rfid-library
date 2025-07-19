"use client"

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
import { AlertTriangle } from "lucide-react"

interface BookTheftAlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bookId: string
  bookTitle: string
  theftTime: Date
}

export function BookTheftAlertDialog({ open, onOpenChange, bookId, bookTitle, theftTime }: BookTheftAlertDialogProps) {
  const handleAcknowledge = () => {
    console.log("Acknowledging theft alert:", { bookId, bookTitle, theftTime })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Book Theft Alert
          </DialogTitle>
          <DialogDescription>A book theft has been detected. Please review the details below.</DialogDescription>
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
            <Label htmlFor="theftTime" className="text-right">
              Theft Time
            </Label>
            <Input id="theftTime" value={theftTime.toLocaleString()} className="col-span-3" disabled />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleAcknowledge} variant="destructive">
            Acknowledge Alert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
