'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

// Add ayah to memorization (creates SpacedRepetition record)
export async function addToMemorization(ayahId: number) {
  try {
    await prisma.spacedRepetition.upsert({
      where: { ayah_id: ayahId },
      update: {},
      create: {
        ayah_id: ayahId,
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0,
        nextReviewDate: new Date(),
      },
    });
    revalidatePath('/surahs');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to add to memorization:', error);
    return { success: false, error: 'Failed to add to memorization' };
  }
}

// SM-2 Algorithm Implementation
// Grades: 1 (Fail), 3 (Hard), 4 (Good), 5 (Easy)
export async function gradeReview(ayahId: number, grade: number) {
  try {
    const record = await prisma.spacedRepetition.findUnique({
      where: { ayah_id: ayahId },
    });

    if (!record) {
      throw new Error('Ayah not found in spaced repetition system');
    }

    let { easeFactor, interval, repetitions } = record;

    if (grade >= 3) {
      repetitions += 1;
      if (repetitions === 1) {
        interval = 1;
      } else if (repetitions === 2) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
    } else {
      repetitions = 0;
      interval = 1;
    }

    // PRD: new_easeFactor = easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)). Must be >= 1.3.
    easeFactor = easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
    if (easeFactor < 1.3) {
      easeFactor = 1.3;
    }

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + interval);

    await prisma.spacedRepetition.update({
      where: { ayah_id: ayahId },
      data: {
        easeFactor,
        interval,
        repetitions,
        nextReviewDate,
      },
    });

    revalidatePath('/review');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to grade review:', error);
    return { success: false, error: 'Failed to grade review' };
  }
}

export async function getDueReviews() {
  const today = new Date();

  const reviews = await prisma.spacedRepetition.findMany({
    where: {
      nextReviewDate: {
        lte: today,
      },
    },
    include: {
      ayah: {
        include: {
          surah: true
        }
      }
    },
    orderBy: {
      nextReviewDate: 'asc'
    }
  });

  return reviews;
}

export async function getDueReviewsCount() {
  const today = new Date();
  const count = await prisma.spacedRepetition.count({
    where: {
      nextReviewDate: {
        lte: today,
      },
    },
  });
  return count;
}
