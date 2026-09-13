-- CreateTable
CREATE TABLE "Stroke" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "points" JSONB NOT NULL,
    "color" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Stroke_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Stroke_roomId_createdAt_idx" ON "Stroke"("roomId", "createdAt");

-- AddForeignKey
ALTER TABLE "Stroke" ADD CONSTRAINT "Stroke_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
