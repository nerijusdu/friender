/*
  Warnings:

  - You are about to drop the column `accepted` on the `RankRequest` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RankRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user1Id" TEXT NOT NULL,
    "user2Id" TEXT NOT NULL,
    "accepted1" BOOLEAN NOT NULL DEFAULT false,
    "accepted2" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_RankRequest" ("id", "user1Id", "user2Id") SELECT "id", "user1Id", "user2Id" FROM "RankRequest";
DROP TABLE "RankRequest";
ALTER TABLE "new_RankRequest" RENAME TO "RankRequest";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
