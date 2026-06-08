Project Context: Quran SRS App (Qalun Edition)

1. The Vision

This project is a personal learning tool designed to solve a specific problem: most Quran memorization apps use the standard "Hafs" recitation and do not incorporate scientific learning methods.
This application focuses strictly on the Riwayat Qalun 'an Nafi' and uses a Spaced Repetition System (SRS) to ensure long-term retention.

2. Domain Knowledge (Quranic Science)

Riwayat Qalun: This is a specific canonical transmission of the Quran, prevalent in North and West Africa. It has unique phonetic rules (Tajweed) and its Arabic script (Rasm Uthmani) has different stop marks and vowel indicators compared to the standard Hafs version.

Ahkam Tajweed: The phonetic rules of recitation. The app must be prepared to handle color-coded text to indicate these rules (e.g., highlighting nasalization 'Ghunna' or elongations 'Madd').

3. Pedagogical Concept: Spaced Repetition (SRS)

The app relies on the SM-2 Algorithm.

Users do not just "read" the Quran. They are tested. The app hides the verse, asks the user to recite it from memory, and then the user grades their own performance (Fail, Hard, Good, Easy).

Based on the grade, the algorithm calculates the optimal number of days before the user should review that specific verse again.

4. Target Environment

Platform: Progressive Web App (PWA).

Primary Device: Mobile Phone.

Goal: To eventually function offline (or at least provide a seamless mobile experience with minimal data usage) so the user can review verses anywhere (e.g., public transport).
