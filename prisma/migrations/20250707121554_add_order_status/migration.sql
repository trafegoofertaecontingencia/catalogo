-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('DRAFT', 'PAID', 'CANCELED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "total" DOUBLE PRECISION NOT NULL DEFAULT 0;
