/*
  Warnings:

  - The primary key for the `books` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `author` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `isbn` on the `books` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_books" (
    "bookId" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_books" ("bookId", "createdAt", "isAvailable", "title", "updatedAt") SELECT "bookId", "createdAt", "isAvailable", "title", "updatedAt" FROM "books";
DROP TABLE "books";
ALTER TABLE "new_books" RENAME TO "books";
CREATE TABLE "new_borrowings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "borrowedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" DATETIME NOT NULL,
    "returnedAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "lateFine" REAL NOT NULL DEFAULT 0.0,
    "bookId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "borrowings_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books" ("bookId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_borrowings" ("bookId", "borrowedAt", "createdAt", "dueDate", "id", "lateFine", "returnedAt", "status", "studentId", "updatedAt") SELECT "bookId", "borrowedAt", "createdAt", "dueDate", "id", "lateFine", "returnedAt", "status", "studentId", "updatedAt" FROM "borrowings";
DROP TABLE "borrowings";
ALTER TABLE "new_borrowings" RENAME TO "borrowings";
CREATE TABLE "new_theft_alerts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timeStolen" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "bookId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "theft_alerts_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books" ("bookId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_theft_alerts" ("bookId", "createdAt", "id", "notes", "resolved", "timeStolen", "updatedAt") SELECT "bookId", "createdAt", "id", "notes", "resolved", "timeStolen", "updatedAt" FROM "theft_alerts";
DROP TABLE "theft_alerts";
ALTER TABLE "new_theft_alerts" RENAME TO "theft_alerts";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
