import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const prisma = new PrismaClient();

export default async function SurahsPage() {
  const surahs = await prisma.surah.findMany({
    orderBy: {
      id: 'asc',
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Surah Index</h1>
        <p className="text-muted-foreground mt-1">
          Select a Surah to view its Ayahs and add to memorization.
        </p>
      </header>

      <div className="grid gap-3">
        {surahs.map((surah) => (
          <Link key={surah.id} href={`/surahs/${surah.id}`} passHref>
            <Card className="hover:bg-accent hover:text-accent-foreground transition-colors">
              <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                    {surah.id}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{surah.name_latin}</CardTitle>
                    <CardDescription>{surah.revelation_type} • {surah.total_ayahs} Ayahs</CardDescription>
                  </div>
                </div>
                <div className="text-lg font-arabic" dir="rtl">
                  {surah.name_arabic}
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}