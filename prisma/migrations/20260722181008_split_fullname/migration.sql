-- AlterTable
ALTER TABLE "applicants" DROP COLUMN "fullName",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;
