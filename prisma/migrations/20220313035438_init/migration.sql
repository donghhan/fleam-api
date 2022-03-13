/*
  Warnings:

  - The primary key for the `Hashtag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Photo` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "_HashtagToPhoto" DROP CONSTRAINT "_HashtagToPhoto_A_fkey";

-- DropForeignKey
ALTER TABLE "_HashtagToPhoto" DROP CONSTRAINT "_HashtagToPhoto_B_fkey";

-- AlterTable
ALTER TABLE "Hashtag" DROP CONSTRAINT "Hashtag_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Hashtag_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Hashtag_id_seq";

-- AlterTable
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Photo_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Photo_id_seq";

-- AlterTable
ALTER TABLE "_HashtagToPhoto" ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "_HashtagToPhoto" ADD FOREIGN KEY ("A") REFERENCES "Hashtag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HashtagToPhoto" ADD FOREIGN KEY ("B") REFERENCES "Photo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
