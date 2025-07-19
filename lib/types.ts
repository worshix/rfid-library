export interface Book {
  bookId: string
  title: string
}

export interface Borrowing {
  id: string
  bookId: string
  bookTitle: string
  studentId: string
  borrowedDate: Date
  dueDate: Date
  status: "intime" | "late"
  lateFine: number
}

export interface Alert {
  id: string
  bookId: string
  bookTitle: string
  timeStolen: Date
}
