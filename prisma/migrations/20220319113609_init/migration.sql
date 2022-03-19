/*
  Warnings:

  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Hashtag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Like` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Photo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_HashtagToPhoto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_HashtagToProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PhotoToProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_photoId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_photoId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_productId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_userId_fkey";

-- DropForeignKey
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_userId_fkey";

-- DropForeignKey
ALTER TABLE "_HashtagToPhoto" DROP CONSTRAINT "_HashtagToPhoto_A_fkey";

-- DropForeignKey
ALTER TABLE "_HashtagToPhoto" DROP CONSTRAINT "_HashtagToPhoto_B_fkey";

-- DropForeignKey
ALTER TABLE "_HashtagToProduct" DROP CONSTRAINT "_HashtagToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_HashtagToProduct" DROP CONSTRAINT "_HashtagToProduct_B_fkey";

-- DropForeignKey
ALTER TABLE "_PhotoToProduct" DROP CONSTRAINT "_PhotoToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_PhotoToProduct" DROP CONSTRAINT "_PhotoToProduct_B_fkey";

-- DropTable
DROP TABLE "Comment";

-- DropTable
DROP TABLE "Hashtag";

-- DropTable
DROP TABLE "Like";

-- DropTable
DROP TABLE "Photo";

-- DropTable
DROP TABLE "_HashtagToPhoto";

-- DropTable
DROP TABLE "_HashtagToProduct";

-- DropTable
DROP TABLE "_PhotoToProduct";
