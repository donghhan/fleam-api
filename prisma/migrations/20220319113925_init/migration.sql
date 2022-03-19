-- CreateTable
CREATE TABLE "Hashtag" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" TEXT,

    CONSTRAINT "Hashtag_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Hashtag" ADD CONSTRAINT "Hashtag_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
