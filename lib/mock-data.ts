import type { Book, Borrowing, Alert } from "./types"

export const mockBooks: Book[] = [
  { id: "B001", title: "Introduction to Programming" },
  { id: "B002", title: "Data Structures and Algorithms" },
  { id: "B003", title: "Web Development Fundamentals" },
  { id: "B004", title: "Database Design Principles" },
  { id: "B005", title: "Machine Learning Basics" },
]

export const mockBorrowings: Borrowing[] = [
  {
    id: "BR001",
    bookId: "B001",
    bookTitle: "Introduction to Programming",
    studentId: "S001",
    borrowedDate: new Date("2024-01-01"),
    dueDate: new Date("2024-01-15"),
    status: "late",
    lateFine: 5.0,
  },
  {
    id: "BR002",
    bookId: "B002",
    bookTitle: "Data Structures and Algorithms",
    studentId: "S002",
    borrowedDate: new Date("2024-01-10"),
    dueDate: new Date("2024-01-24"),
    status: "intime",
    lateFine: 0,
  },
  {
    id: "BR003",
    bookId: "B003",
    bookTitle: "Web Development Fundamentals",
    studentId: "S003",
    borrowedDate: new Date("2023-12-20"),
    dueDate: new Date("2024-01-03"),
    status: "late",
    lateFine: 15.0,
  },
]

export const mockAlerts: Alert[] = [
  {
    id: "A001",
    bookId: "B004",
    bookTitle: "Database Design Principles",
    timeStolen: new Date("2024-01-15T14:30:00"),
  },
  {
    id: "A002",
    bookId: "B005",
    bookTitle: "Machine Learning Basics",
    timeStolen: new Date("2024-01-16T09:15:00"),
  },
]
