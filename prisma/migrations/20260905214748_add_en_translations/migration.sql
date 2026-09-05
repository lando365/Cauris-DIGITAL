-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "contentEn" TEXT,
ADD COLUMN     "excerptEn" TEXT,
ADD COLUMN     "titleEn" TEXT;

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "descriptionEn" TEXT,
ADD COLUMN     "titleEn" TEXT;

-- AlterTable
ALTER TABLE "startups" ADD COLUMN     "achievementsEn" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "descriptionEn" TEXT,
ADD COLUMN     "longDescriptionEn" TEXT,
ADD COLUMN     "metricsEn" JSONB,
ADD COLUMN     "taglineEn" TEXT;
