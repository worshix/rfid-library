"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Book } from "@/lib/types"
import { Edit, Trash2 } from "lucide-react"
import axios from "axios"
import {toast} from "sonner"

export default function LibraryPage() {
  const [books, setBooks] = useState([])
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [deletingBook, setDeletingBook] = useState<Book | null>(null)
  const [addingBook, setAddingBook] = useState<Book | null>(null)
  const [editForm, setEditForm] = useState({ title: "", bookId: "" })

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('/api/books');
        if (response.status === 200) {
          setBooks(response.data);
        } else {
          toast.error("Failed to fetch books");
        }
      } catch (error) {
        console.error("Error fetching books:", error);
        toast.error("Failed to fetch books", { description: error instanceof Error ? error.message : "Unknown error" });
      }
    };
    fetchBooks();
  }, [addingBook, editingBook, deletingBook]);


  const handleEdit = (book: Book) => {
    setEditingBook(book)
    setEditForm({ title: book.title, bookId: book.bookId })
  }

  const handleEditSubmit = async () => {
    try {
      const response = await axios.put('/api/books', {
        ...editForm
      })
      if (response.status === 200) {
        toast.success("Book updated successfully")
      } else {
        toast.error("Failed to update book")
      }
    } catch (error) {
      console.error("Error updating book:", error)
      toast.error("Failed to update book", { description: error instanceof Error ? error.message : "Unknown error" })
    }

    setEditingBook(null)
    setEditForm({ title: "", bookId: "" })
  }
  const handleAddBook = (book: Book) => {
    setAddingBook(book)
    setEditForm({ title: book.title, bookId: book.bookId })
  }

  const handleAddSubmit = async () => {
    try{
      const response = await axios.post('/api/books', {
        title: editForm.title,
        bookId: editForm.bookId
      })
      if (response.status === 201) {
        toast.success("Book added successfully")
      } else {
        toast.error("Failed to add book")
      }
    }
    catch(error){
      console.error("Error adding book:", error)
      toast.error("Failed to add book", { description: error instanceof Error ? error.message : "Unknown error" })
    }
    setAddingBook(null)
    setEditForm({ title: "", bookId: "" })
  }

  const handleDelete = (book: Book) => {
    setDeletingBook(book)
  }

  const handleDeleteConfirm = async () => {
    console.log("Deleting book:", deletingBook?.bookId)
    try{
      const response = await axios.delete('/api/books', {
        data: { bookId: deletingBook?.bookId }
      })
      if (response.status === 200) {
        toast.success("Book deleted successfully")
      } else {
        toast.error("Failed to delete book")
      }
    } catch (error) {
      console.error("Error deleting book:", error)
      toast.error("Failed to delete book", { description: error instanceof Error ? error.message : "Unknown error" })
    }
    setDeletingBook(null)
  }

  return (
    <SidebarInset className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-xl font-semibold">Library Management</h1>
        <Button className="ml-auto" onClick={() => handleAddBook({ bookId: "", title: "" })}>
          Add Book
        </Button>
      </header>
      <div className="flex-1 space-y-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Book Collection</CardTitle>
            <CardDescription>Manage your library&apos;s book collection</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>RFID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.map((book) => (
                  <TableRow key={book.bookId}>
                    <TableCell className="font-medium">{book.bookId}</TableCell>
                    <TableCell>{book.title}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(book)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(book)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Edit Book Dialog */}
      <Dialog open={!!editingBook} onOpenChange={() => setEditingBook(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
            <DialogDescription>Make changes to the book information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">
                Title
              </Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleEditSubmit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Book Dialog */}
      <Dialog open={!!deletingBook} onOpenChange={() => setDeletingBook(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Book</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingBook?.title}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingBook(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Adding Book Dialog Box */}
      <Dialog open={!!addingBook} onOpenChange={() => setAddingBook(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Book</DialogTitle>
            <DialogDescription>Fill in the details to add a new book.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">
                Title
              </Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-isbn" className="text-right">
                RFID
              </Label>
              <Input
                id="edit-isbn"
                value={editForm.bookId}
                onChange={(e) => setEditForm({ ...editForm, bookId: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddSubmit}>
              Add Book
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </SidebarInset>
  )
}
