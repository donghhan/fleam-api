-- DropForeignKey
ALTER TABLE "Hashtag" DROP CONSTRAINT "Hashtag_productId_fkey";

-- CreateTable
CREATE TABLE "_HashtagToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_HashtagToProduct_AB_unique" ON "_HashtagToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_HashtagToProduct_B_index" ON "_HashtagToProduct"("B");

-- AddForeignKey
ALTER TABLE "_HashtagToProduct" ADD FOREIGN KEY ("A") REFERENCES "Hashtag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HashtagToProduct" ADD FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
