/*
  Warnings:

  - You are about to drop the column `createdAt` on the `theft_alerts` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `theft_alerts` table. All the data in the column will be lost.
  - You are about to drop the column `resolved` on the `theft_alerts` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `theft_alerts` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_theft_alerts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timeStolen" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bookId" TEXT NOT NULL,
    CONSTRAINT "theft_alerts_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books" ("bookId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_theft_alerts" ("bookId", "id", "timeStolen") SELECT "bookId", "id", "timeStolen" FROM "theft_alerts";
DROP TABLE "theft_alerts";
ALTER TABLE "new_theft_alerts" RENAME TO "theft_alerts";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
