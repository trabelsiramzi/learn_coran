import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { addToMemorization } from "@/app/actions/srs";

const prisma = new PrismaClient();

interface SurahPageProps {
  params: {
    id: string;
  };
}

export default async function SurahDetailPage({ params }: SurahPageProps) {
  const surahId = parseInt(params.id, 10);
  if (isNaN(surahId)) {
    notFound();
  }

  const surah = await prisma.surah.findUnique({
    where: { id: surahId },
    include: {
      ayahs: {
        orderBy: { number_in_surah: 'asc' },
        include: {
          reviews: true,
        }
      },
    },
  });

  if (!surah) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="text-center py-4 border-b">
        <h1 className="text-3xl font-arabic font-bold mb-2" dir="rtl">{surah.name_arabic}</h1>
        <h2 className="text-xl font-bold tracking-tight">{surah.name_latin}</h2>
      </header>

      <div className="flex flex-col gap-4">
        {surah.ayahs.map((ayah) => {
          const isMemorized = !!ayah.reviews;

          return (
            <Card key={ayah.id} className="relative">
              <CardContent className="p-4 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold">
                    {ayah.number_in_surah}
                  </span>
                  <form action={async () => {
                    'use server';
                    await addToMemorization(ayah.id);
                  }}>
                    <Button
                      type="submit"
                      variant={isMemorized ? "secondary" : "default"}
                      size="sm"
                      disabled={isMemorized}
                    >
                      {isMemorized ? "In SRS" : "Add to Memorization"}
                    </Button>
                  </form>
                </div>

                <p
                  className="text-2xl leading-loose font-arabic text-right mt-2"
                  dir="rtl"
                  dangerouslySetInnerHTML={{ __html: ayah.text_rasm }}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}