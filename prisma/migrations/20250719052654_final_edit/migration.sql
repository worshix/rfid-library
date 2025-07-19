/*
  Warnings:

  - You are about to drop the column `lateFine` on the `borrowings` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_borrowings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "borrowedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" DATETIME NOT NULL,
    "returnedAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'active',
    "bookId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "borrowings_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books" ("bookId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_borrowings" ("bookId", "borrowedAt", "createdAt", "dueDate", "id", "returnedAt", "status", "studentId", "updatedAt") SELECT "bookId", "borrowedAt", "createdAt", "dueDate", "id", "returnedAt", "status", "studentId", "updatedAt" FROM "borrowings";
DROP TABLE "borrowings";
ALTER TABLE "new_borrowings" RENAME TO "borrowings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
