/*
  Warnings:

  - A unique constraint covering the columns `[date,student_id,timetable_slot_id]` on the table `attendance` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `timetable_slot_id` to the `attendance` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "attendance_date_student_id_subject_id_key";

-- AlterTable
ALTER TABLE "attendance" ADD COLUMN     "timetable_slot_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "attendance_date_student_id_timetable_slot_id_key" ON "attendance"("date", "student_id", "timetable_slot_id");

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_timetable_slot_id_fkey" FOREIGN KEY ("timetable_slot_id") REFERENCES "timetable_slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
