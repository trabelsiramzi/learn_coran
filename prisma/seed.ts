import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed script...');
  const API_URL = 'http://api.alquran.cloud/v1/quran/quran-qalun';

  console.log(`Fetching data from ${API_URL}`);
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  const data = await response.json();
  const surahs = data.data.surahs;

  console.log(`Fetched ${surahs.length} surahs. Seeding...`);

  for (const surah of surahs) {
    console.log(`Processing Surah: ${surah.englishName}`);

    await prisma.surah.upsert({
      where: { id: surah.number },
      update: {},
      create: {
        id: surah.number,
        name_arabic: surah.name,
        name_latin: surah.englishName,
        revelation_type: surah.revelationType,
        total_ayahs: surah.ayahs.length,
      },
    });

    const ayahsData = surah.ayahs.map((ayah: any) => ({
      id: ayah.number, // The global ayah number
      surah_id: surah.number,
      number_in_surah: ayah.numberInSurah,
      text_rasm: ayah.text,
      // The Alquran API response for quran edition might not have audio_url at this endpoint,
      // but if it does, or we keep it null
      audio_url: ayah.audio || null,
    }));

    // Create ayahs in chunks or simply one by one/createMany
    await prisma.ayah.createMany({
      data: ayahsData,
      skipDuplicates: true,
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
