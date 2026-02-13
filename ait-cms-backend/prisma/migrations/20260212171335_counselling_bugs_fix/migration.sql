-- AlterTable
ALTER TABLE "students" ADD COLUMN     "counsellor_id" TEXT;

-- AlterTable
ALTER TABLE "teachers" ADD COLUMN     "is_counsellor" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "counselling_sessions" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "counsellor_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT NOT NULL,
    "action_items" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "counselling_sessions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_counsellor_id_fkey" FOREIGN KEY ("counsellor_id") REFERENCES "teachers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "counselling_sessions" ADD CONSTRAINT "counselling_sessions_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "counselling_sessions" ADD CONSTRAINT "counselling_sessions_counsellor_id_fkey" FOREIGN KEY ("counsellor_id") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
