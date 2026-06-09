'use client';

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { gradeReview } from "@/app/actions/srs";

interface ReviewCardProps {
  review: {
    ayah_id: number;
    ayah: {
      number_in_surah: number;
      text_rasm: string;
      surah: {
        name_latin: string;
        name_arabic: string;
      };
    };
  };
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGrade = async (grade: number) => {
    setIsSubmitting(true);
    await gradeReview(review.ayah_id, grade);
    setIsSubmitting(false);
    setIsRevealed(false); // Reset state for the next card
  };

  return (
    <Card className="w-full max-w-md mx-auto min-h-[300px] flex flex-col justify-between shadow-lg">
      <CardContent className="flex-1 p-6 flex flex-col justify-center items-center text-center gap-6">
        <div className="flex flex-col items-center">
          <span className="text-sm text-muted-foreground uppercase tracking-widest font-semibold mb-1">
            {review.ayah.surah.name_latin}
          </span>
          <span className="text-xl font-arabic" dir="rtl">
            {review.ayah.surah.name_arabic}
          </span>
          <span className="mt-2 inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
            {review.ayah.number_in_surah}
          </span>
        </div>

        {isRevealed ? (
          <div
            className="text-4xl leading-loose font-arabic mt-6 w-full px-2"
            dir="rtl"
            dangerouslySetInnerHTML={{ __html: review.ayah.text_rasm }}
          />
        ) : (
          <div className="mt-6 w-full h-32 flex items-center justify-center border-2 border-dashed rounded-lg border-muted">
            <span className="text-muted-foreground font-medium">Recite from memory...</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 bg-muted/30 border-t flex-col gap-3">
        {!isRevealed ? (
          <Button
            className="w-full text-lg h-14"
            onClick={() => setIsRevealed(true)}
          >
            Reveal Answer
          </Button>
        ) : (
          <div className="w-full flex flex-col gap-2">
            <span className="text-sm text-center text-muted-foreground font-medium mb-1">
              How well did you remember?
            </span>
            <div className="grid grid-cols-4 gap-2">
              <Button
                variant="destructive"
                onClick={() => handleGrade(1)}
                disabled={isSubmitting}
                className="h-12 flex-col gap-1 text-xs sm:text-sm"
              >
                <span>Fail</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => handleGrade(3)}
                disabled={isSubmitting}
                className="h-12 flex-col gap-1 text-xs sm:text-sm border-orange-500 text-orange-600 hover:bg-orange-50"
              >
                <span>Hard</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => handleGrade(4)}
                disabled={isSubmitting}
                className="h-12 flex-col gap-1 text-xs sm:text-sm border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                <span>Good</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => handleGrade(5)}
                disabled={isSubmitting}
                className="h-12 flex-col gap-1 text-xs sm:text-sm border-green-500 text-green-600 hover:bg-green-50"
              >
                <span>Easy</span>
              </Button>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}