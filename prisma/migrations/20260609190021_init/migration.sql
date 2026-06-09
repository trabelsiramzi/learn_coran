-- CreateTable
CREATE TABLE "Surah" (
    "id" INTEGER NOT NULL,
    "name_arabic" TEXT NOT NULL,
    "name_latin" TEXT NOT NULL,
    "revelation_type" TEXT NOT NULL,
    "total_ayahs" INTEGER NOT NULL,

    CONSTRAINT "Surah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ayah" (
    "id" SERIAL NOT NULL,
    "surah_id" INTEGER NOT NULL,
    "number_in_surah" INTEGER NOT NULL,
    "text_rasm" TEXT NOT NULL,
    "audio_url" TEXT,

    CONSTRAINT "Ayah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpacedRepetition" (
    "ayah_id" INTEGER NOT NULL,
    "easeFactor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "interval" INTEGER NOT NULL DEFAULT 0,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "nextReviewDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpacedRepetition_pkey" PRIMARY KEY ("ayah_id")
);

-- AddForeignKey
ALTER TABLE "Ayah" ADD CONSTRAINT "Ayah_surah_id_fkey" FOREIGN KEY ("surah_id") REFERENCES "Surah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpacedRepetition" ADD CONSTRAINT "SpacedRepetition_ayah_id_fkey" FOREIGN KEY ("ayah_id") REFERENCES "Ayah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
