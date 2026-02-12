-- DropForeignKey
ALTER TABLE "clubs" DROP CONSTRAINT "clubs_organizer_id_fkey";

-- AlterTable
ALTER TABLE "clubs" ALTER COLUMN "organizer_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "clubs" ADD CONSTRAINT "clubs_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "organizers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
