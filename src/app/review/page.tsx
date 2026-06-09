import { getDueReviews } from "@/app/actions/srs";
import ReviewCard from "./ReviewCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function ReviewPage() {
  const dueReviews = await getDueReviews();

  if (dueReviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 gap-4">
        <h1 className="text-2xl font-bold">All caught up!</h1>
        <p className="text-muted-foreground">
          You have no ayahs to review right now. Come back later or add more ayahs to your memorization.
        </p>
        <Link href="/surahs" passHref>
          <Button>Browse Surahs</Button>
        </Link>
      </div>
    );
  }

  // Pass the first due review to the client component
  const currentReview = dueReviews[0];

  return (
    <div className="flex flex-col h-full py-4 gap-6">
      <header className="flex justify-between items-center px-2">
        <h1 className="text-2xl font-bold">Review Session</h1>
        <span className="text-sm font-medium bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
          {dueReviews.length} remaining
        </span>
      </header>

      <div className="flex-1 flex flex-col justify-center pb-10">
        <ReviewCard review={currentReview} />
      </div>
    </div>
  );
}