Product Requirements Document (PRD): Quran SRS Learning App (Qalun Edition)

Note to Agent: Please read CONTEXT.md for domain knowledge and AGENT.md for coding guidelines before executing this PRD.

1. Context & Goal

Build a complete Spaced Repetition System (SRS) application for memorizing the Quran, specifically optimized for the "Riwayat Qalun 'an Nafi'". The app must be a mobile-first Progressive Web App (PWA).

2. Tech Stack

Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui.

PostgreSQL (Supabase), Prisma, Next.js Server Actions.

3. Data Sources & Seeding Strategy

Use the global Quran API http://api.alquran.cloud/v1.

Edition identifier for Qalun text: quran-qalun (or ar.qalun).

Write a standalone seed script (prisma/seed.ts) that fetches Surahs and Ayahs from this API and populates the database.

Tajweed (Ahkam): Build the UI to support HTML/Span based color-coding in the text_rasm field (e.g., <span class="tajweed-ghunna">...</span>).

4. Database Architecture (Prisma Schema)

Use the exact following schema:

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Surah {
  id               Int     @id
  name_arabic      String
  name_latin       String
  revelation_type  String
  total_ayahs      Int
  ayahs            Ayah[]
}

model Ayah {
  id               Int      @id @default(autoincrement())
  surah_id         Int
  number_in_surah  Int
  text_rasm        String   // Arabic text optimized for Qalun
  audio_url        String?
  surah            Surah    @relation(fields: [surah_id], references: [id])
  reviews          SpacedRepetition?
}

model SpacedRepetition {
  ayah_id          Int      @id
  easeFactor       Float    @default(2.5)
  interval         Int      @default(0)
  repetitions      Int      @default(0)
  nextReviewDate   DateTime @default(now())
  ayah             Ayah     @relation(fields: [ayah_id], references: [id])
}


5. Core Logic: SM-2 Algorithm

Create a Server Action (app/actions/srs.ts).
Grades: 1: Fail, 3: Hard, 4: Good, 5: Easy.

If grade >= 3:

repetitions += 1

interval = (repetitions == 1) ? 1 : (repetitions == 2) ? 6 : Math.round(interval * easeFactor)

If grade < 3:

repetitions = 0

interval = 1

new_easeFactor = easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)). Must be >= 1.3.

nextReviewDate = current date + interval (in days).

6. Views & Routing

A. Dashboard (app/page.tsx)

"Ayahs to review today" count (nextReviewDate <= today).

"Start Review Session" Call-to-Action.

B. Review Session (app/review/page.tsx)

Fetch first Ayah due.

State 1 (Hidden): Show Surah/Ayah number. Arabic text HIDDEN. "Reveal Answer" button.

State 2 (Revealed): Arabic text displayed (text-4xl, dir="rtl"). 4 grading buttons (Fail/Hard/Good/Easy).

Clicking grade updates DB via Server Action, loads next Ayah.

C. Surah Index (app/surahs/page.tsx)

List of all Surahs.

Clicking one opens Ayahs.

"Add to Memorization" button per Ayah (creates SpacedRepetition record with default values).

7. Execution Steps for the Agent

Setup Next.js, Tailwind, shadcn/ui.

Initialize Prisma with the schema.

Write prisma/seed.ts to fetch Qalun data.

Implement SM-2 Server Actions.

Build UI components (Dashboard, Review Card, Surah List).

Integrate UI with Server Actions.
