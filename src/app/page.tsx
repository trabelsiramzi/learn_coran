import Link from "next/link";
import { getDueReviewsCount } from "./actions/srs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const dueCount = await getDueReviewsCount();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back to your Quran memorization journey.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Daily Review</CardTitle>
          <CardDescription>
            Ayahs due for review today based on spaced repetition.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-6 gap-4">
          <div className="text-5xl font-extrabold text-primary">
            {dueCount}
          </div>
          <div className="text-muted-foreground font-medium">
            Ayahs to review today
          </div>

          <div className="w-full mt-4">
            <Link href="/review" passHref>
              <Button className="w-full text-lg h-12" disabled={dueCount === 0}>
                Start Review Session
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {dueCount === 0 && (
        <p className="text-center text-sm text-muted-foreground px-4">
          You have caught up with all reviews! Head to the <Link href="/surahs" className="text-primary hover:underline">Surahs</Link> page to add more ayahs to your memorization.
        </p>
      )}
    </div>
  );
}