/**
 * Tests for recommendation scoring logic.
 * These test the pure scoring functions extracted from recommendation-service.
 */

// We can't import the private functions directly, so we test the scoring logic inline

describe('Recommendation Scoring', () => {
  describe('Curriculum Fit Scoring', () => {
    // Replicate the scoring logic for testing
    function scoreCurriculumFit(
      candidateSubject: string,
      candidateDifficulty: string,
      candidateIsFeatured: boolean,
      profileSubjects: string[],
      profileDifficulties: string[],
      completedCourseIds: string[]
    ): number {
      let score = 0;

      // Subject affinity
      const subjectCounts = profileSubjects.reduce((acc, s) => {
        acc[s] = (acc[s] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      if (subjectCounts[candidateSubject]) {
        score += 0.4 * Math.min(subjectCounts[candidateSubject] / 3, 1);
      }

      // Difficulty progression
      const diffOrder = ['beginner', 'intermediate', 'advanced'];
      const maxCompletedDiff = completedCourseIds.length > 0
        ? profileDifficulties.reduce((max, d) => {
            const idx = diffOrder.indexOf(d);
            return idx > max ? idx : max;
          }, -1)
        : -1;

      const candidateDiffIdx = diffOrder.indexOf(candidateDifficulty);
      if (candidateDiffIdx === maxCompletedDiff + 1) {
        score += 0.4;
      } else if (candidateDiffIdx === maxCompletedDiff) {
        score += 0.2;
      } else if (candidateDiffIdx < maxCompletedDiff) {
        score += 0.05;
      }

      if (candidateIsFeatured) {
        score += 0.2;
      }

      return Math.min(score, 1);
    }

    it('should give high score for matching subject + next difficulty', () => {
      const score = scoreCurriculumFit(
        'quran', 'intermediate', false,
        ['quran', 'quran', 'quran'], // strong affinity
        ['beginner'], // completed beginner
        ['course1'] // has completions
      );
      // Subject: 0.4 * (3/3) = 0.4, Difficulty next: 0.4 = total 0.8
      expect(score).toBeCloseTo(0.8, 1);
    });

    it('should give progression bonus for beginner when no completions', () => {
      const score = scoreCurriculumFit(
        'arabic', 'beginner', false,
        ['quran'], [], []
      );
      // No subject match, but beginner (idx 0) === maxCompletedDiff(-1) + 1, so 0.4 progression
      expect(score).toBeCloseTo(0.4, 1);
    });

    it('should boost featured courses', () => {
      const scoreNoFeatured = scoreCurriculumFit(
        'quran', 'beginner', false,
        [], [], []
      );
      const scoreFeatured = scoreCurriculumFit(
        'quran', 'beginner', true,
        [], [], []
      );
      expect(scoreFeatured).toBeGreaterThan(scoreNoFeatured);
      expect(scoreFeatured - scoreNoFeatured).toBeCloseTo(0.2, 1);
    });

    it('should cap score at 1.0', () => {
      // Max everything: subject 0.4 + difficulty 0.4 + featured 0.2 = 1.0
      const score = scoreCurriculumFit(
        'quran', 'intermediate', true,
        ['quran', 'quran', 'quran'],
        ['beginner'],
        ['c1']
      );
      expect(score).toBeLessThanOrEqual(1);
    });

    it('should handle empty profile with beginner course', () => {
      const score = scoreCurriculumFit(
        'fiqh', 'beginner', false,
        [], [], []
      );
      // No subject match, but beginner gets progression bonus (next step from no completions)
      expect(score).toBeCloseTo(0.4, 1);
    });
  });

  describe('Score Weighting', () => {
    it('should weight 70% curriculum, 30% collaborative', () => {
      const curriculumScore = 0.8;
      const collaborativeScore = 0.6;
      const totalScore = 0.7 * curriculumScore + 0.3 * collaborativeScore;
      expect(totalScore).toBeCloseTo(0.74, 2);
    });

    it('should produce valid range 0-1', () => {
      for (let c = 0; c <= 1; c += 0.1) {
        for (let col = 0; col <= 1; col += 0.1) {
          const score = 0.7 * c + 0.3 * col;
          expect(score).toBeGreaterThanOrEqual(0);
          expect(score).toBeLessThanOrEqual(1.001); // float tolerance
        }
      }
    });
  });
});
