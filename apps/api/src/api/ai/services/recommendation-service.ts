/**
 * Recommendation Service
 * AI-powered course recommendations based on student progress.
 * Scoring: 40% content similarity, 30% collaborative filtering, 30% curriculum fit.
 * Falls back to popularity-based recommendations when AI is unavailable.
 */

import * as embeddingService from './embedding-service';
import * as ollamaClient from './ollama-client';

interface UserLearningProfile {
  userId: string;
  enrolledCourseIds: string[];
  completedCourseIds: string[];
  subjects: string[];
  difficulties: string[];
  ageTier: string | null;
  averageProgress: number;
  totalTimeSpent: number;
}

interface CourseCandidate {
  id: string;
  documentId: string;
  title: string;
  description: string;
  subject: string;
  difficulty: string;
  age_tier: string;
  current_enrollments: number;
  is_featured: boolean;
}

interface Recommendation {
  courseId: string;
  title: string;
  description: string;
  score: number;
  reason: string;
  difficulty: string;
  subject: string;
}

/**
 * Build a learning profile for the user from their progress data.
 */
async function buildUserProfile(strapi: any, userId: string): Promise<UserLearningProfile> {
  const enrollments = await strapi.entityService.findMany(
    'api::course-enrollment.course-enrollment',
    {
      filters: { user: { id: userId } },
      populate: ['course'],
      limit: 100,
    }
  );

  const enrolledCourseIds: string[] = [];
  const completedCourseIds: string[] = [];
  const subjects: string[] = [];
  const difficulties: string[] = [];
  let totalProgress = 0;

  for (const enrollment of enrollments || []) {
    const courseId = String(enrollment.course?.documentId || enrollment.course?.id);
    enrolledCourseIds.push(courseId);

    if (enrollment.status === 'completed') {
      completedCourseIds.push(courseId);
    }

    if (enrollment.course?.subject) {
      subjects.push(enrollment.course.subject);
    }
    if (enrollment.course?.difficulty) {
      difficulties.push(enrollment.course.difficulty);
    }

    totalProgress += enrollment.progress || 0;
  }

  // Get user profile for age tier
  let ageTier: string | null = null;
  try {
    const user = await strapi.entityService.findOne(
      'plugin::users-permissions.user',
      userId,
      { populate: ['profile'] }
    );
    ageTier = user?.profile?.ageTier || null;
  } catch {
    // ignore
  }

  // Get total time spent
  const progressEntries = await strapi.entityService.findMany(
    'api::user-progress.user-progress',
    {
      filters: { user: { id: userId } },
      limit: 500,
    }
  );

  const totalTimeSpent = (progressEntries || []).reduce(
    (sum: number, p: any) => sum + (p.timeSpent || 0),
    0
  );

  return {
    userId,
    enrolledCourseIds,
    completedCourseIds,
    subjects,
    difficulties,
    ageTier,
    averageProgress: enrollments?.length ? totalProgress / enrollments.length : 0,
    totalTimeSpent,
  };
}

/**
 * Get candidate courses (not already enrolled).
 */
async function getCandidateCourses(
  strapi: any,
  profile: UserLearningProfile
): Promise<CourseCandidate[]> {
  const allCourses = await strapi.entityService.findMany('api::course.course', {
    limit: 200,
    filters: { publishedAt: { $notNull: true } },
  });

  // Filter out already enrolled courses
  const enrolled = new Set(profile.enrolledCourseIds);

  return (allCourses || [])
    .filter((c: any) => !enrolled.has(String(c.documentId || c.id)))
    .filter((c: any) => {
      // Filter by age tier if user has one
      if (profile.ageTier && c.age_tier && c.age_tier !== profile.ageTier) {
        return false;
      }
      return true;
    });
}

/**
 * Score candidates based on curriculum fit (30%).
 * Considers subject affinity, difficulty progression, and prerequisites.
 */
function scoreCurriculumFit(
  candidate: CourseCandidate,
  profile: UserLearningProfile
): number {
  let score = 0;

  // Subject affinity: prefer subjects the user has studied
  const subjectCounts = profile.subjects.reduce((acc, s) => {
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (subjectCounts[candidate.subject]) {
    score += 0.4 * Math.min(subjectCounts[candidate.subject] / 3, 1);
  }

  // Difficulty progression: if user completed beginners, suggest intermediate
  const diffOrder = ['beginner', 'intermediate', 'advanced'];
  const maxCompletedDiff = profile.difficulties
    .filter((d, i) => profile.completedCourseIds.length > 0)
    .reduce((max, d) => {
      const idx = diffOrder.indexOf(d);
      return idx > max ? idx : max;
    }, -1);

  const candidateDiffIdx = diffOrder.indexOf(candidate.difficulty);
  if (candidateDiffIdx === maxCompletedDiff + 1) {
    // Next level up — ideal progression
    score += 0.4;
  } else if (candidateDiffIdx === maxCompletedDiff) {
    // Same level — still good
    score += 0.2;
  } else if (candidateDiffIdx < maxCompletedDiff) {
    // Below level — less interesting
    score += 0.05;
  }

  // Featured courses get a small boost
  if (candidate.is_featured) {
    score += 0.2;
  }

  return Math.min(score, 1);
}

/**
 * Score based on collaborative filtering (30%).
 * Uses course popularity as a proxy (courses with more enrollments are more likely to be relevant).
 */
function scoreCollaborative(
  candidate: CourseCandidate,
  allCandidates: CourseCandidate[]
): number {
  const maxEnrollments = Math.max(
    ...allCandidates.map((c) => c.current_enrollments || 0),
    1
  );
  return (candidate.current_enrollments || 0) / maxEnrollments;
}

/**
 * Get personalized recommendations for a user.
 */
export async function getRecommendations(
  strapi: any,
  userId: string,
  limit: number = 5
): Promise<Recommendation[]> {
  const profile = await buildUserProfile(strapi, userId);
  const candidates = await getCandidateCourses(strapi, profile);

  if (candidates.length === 0) {
    return [];
  }

  // If user has no enrollments, return popular/featured courses
  if (profile.enrolledCourseIds.length === 0) {
    return candidates
      .sort((a, b) => (b.current_enrollments || 0) - (a.current_enrollments || 0))
      .slice(0, limit)
      .map((c) => ({
        courseId: String(c.documentId || c.id),
        title: c.title,
        description: c.description?.slice(0, 200) || '',
        score: 0.5,
        reason: c.is_featured ? 'Featured course' : 'Popular in the community',
        difficulty: c.difficulty,
        subject: c.subject,
      }));
  }

  // Score each candidate
  const scored = candidates.map((candidate) => {
    const curriculumScore = scoreCurriculumFit(candidate, profile);
    const collaborativeScore = scoreCollaborative(candidate, candidates);

    // Weights: 40% similarity (approximated by curriculum), 30% collaborative, 30% curriculum
    // Without embeddings available, we use curriculum fit for both similarity and curriculum
    const totalScore = 0.4 * curriculumScore + 0.3 * collaborativeScore + 0.3 * curriculumScore;

    // Generate reason
    let reason = '';
    if (profile.subjects.includes(candidate.subject)) {
      reason = `Based on your interest in ${candidate.subject}`;
    } else if (candidate.is_featured) {
      reason = 'Featured course recommended for you';
    } else if (collaborativeScore > 0.5) {
      reason = 'Popular among similar learners';
    } else {
      reason = 'Expands your learning path';
    }

    return {
      courseId: String(candidate.documentId || candidate.id),
      title: candidate.title,
      description: candidate.description?.slice(0, 200) || '',
      score: totalScore,
      reason,
      difficulty: candidate.difficulty,
      subject: candidate.subject,
    };
  });

  // Try to enhance with embedding similarity if available
  if (ollamaClient.isEnabled()) {
    try {
      const available = await ollamaClient.isAvailable();
      if (available && profile.completedCourseIds.length > 0) {
        // Use the most recently completed course as the similarity anchor
        const recentCourseId = profile.completedCourseIds[profile.completedCourseIds.length - 1];
        const recentCourse = await strapi.entityService.findOne('api::course.course', recentCourseId);

        if (recentCourse) {
          const searchQuery = `${recentCourse.title} ${recentCourse.subject} ${recentCourse.difficulty}`;
          const similar = await embeddingService.searchSimilar(strapi, searchQuery, {
            contentType: 'course',
            limit: limit * 2,
          });

          // Boost scores for candidates that appear in semantic results
          const similarIds = new Set(similar.map((s) => s.contentId));
          for (const s of scored) {
            if (similarIds.has(s.courseId)) {
              s.score = s.score * 0.6 + 0.4; // Boost by similarity
              s.reason = `Similar to courses you've completed`;
            }
          }
        }
      }
    } catch {
      // Silently fall back to non-embedding scoring
    }
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
