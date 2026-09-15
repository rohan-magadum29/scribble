/*
  Warnings:

  - You are about to drop the `Stroke` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Stroke" DROP CONSTRAINT "Stroke_roomId_fkey";

-- DropTable
DROP TABLE "Stroke";
