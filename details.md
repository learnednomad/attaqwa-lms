# AttaqwaMasjid LMS - Seeded Account Details

## Strapi Admin Panel

| Field | Value |
|-------|-------|
| URL | http://localhost:1337/admin |
| Email | admin@attaqwa.local |
| Password | Admin1234! |
| Role | Super Admin |

## Test User Accounts

| Username | Email | Password | Role | Learning Profile |
|----------|-------|----------|------|-----------------|
| ahmed_student | ahmed@attaqwa.test | Student123! | Student | Active learner, 5 courses, ~60% progress |
| fatima_student | fatima@attaqwa.test | Student123! | Student | Top performer, 4 courses, ~85% progress |
| omar_student | omar@attaqwa.test | Student123! | Student | Beginner, 3 courses, ~25% progress |
| sheikh_instructor | instructor@attaqwa.test | Instructor123! | Instructor | Moderation reviewer |
| admin_user | admin@attaqwa.test | Admin123! | Admin | System admin |

## Seeded Data Summary

| Content Type | Count | Notes |
|---|---|---|
| Courses | 6 | Bootstrap-seeded (Quran, Hadith, Fiqh, Seerah) |
| Lessons | 27 | Bootstrap-seeded across all courses |
| Quizzes | 12 | Bootstrap-seeded with questions |
| Achievements | 15 | 5 types: participation, course_completion, quiz_mastery, streak, special |
| Enrollments | 12 | Ahmed: 5, Fatima: 4, Omar: 3 |
| User Progress | 44 | 30 completed, 9 in_progress, 5 not_started |
| User Achievements | 16 | Ahmed: 6, Fatima: 9, Omar: 1 |
| Streaks | 3 | Ahmed: 12-day, Fatima: 24-day, Omar: 3-day |
| Leaderboard | 3 | Fatima #1 (1850pts), Ahmed #2 (1200pts), Omar #3 (210pts) |
| Moderation Queue | 8 | 3 approved, 3 pending, 1 needs_review, 1 rejected |

## Service URLs

| Service | URL |
|---------|-----|
| Website | http://localhost:3001 |
| Admin Portal | http://localhost:3000 |
| Strapi Admin | http://localhost:1337/admin |
| Strapi API | http://localhost:1337/api/v1 |
| Ollama | http://localhost:11434 |

## Running the Seed

```bash
# Inside Docker
docker exec attaqwa-api-dev sh -c "cd apps/api && npx tsx scripts/seed/seed-complete.ts"

# Or locally
pnpm --filter api seed:complete
```
