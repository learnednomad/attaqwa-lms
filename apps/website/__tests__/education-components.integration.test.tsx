/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EducationContentCard } from '../src/components/features/education/EducationContentCard';
import { AgeTierFilter } from '../src/components/features/education/AgeTierFilter';
import { QuizInterface } from '../src/components/features/education/QuizInterface';
import { 
  AgeTier, 
  IslamicSubject, 
  DifficultyLevel, 
  EducationContentType,
  QuestionType 
} from '@attaqwa/shared';

// Mock data for testing
const createMockContent = (overrides = {}) => ({
  id: 'content-1',
  title: 'Introduction to Quran',
  description: 'Learn the basics of the Holy Quran, its structure, and fundamental teachings.',
  subject: IslamicSubject.QURAN,
  ageTier: AgeTier.ALL_AGES,
  difficultyLevel: DifficultyLevel.BEGINNER,
  contentType: EducationContentType.LESSON,
  estimatedDuration: 30,
  thumbnailUrl: null,
  isPublished: true,
  tags: ['quran', 'basics', 'islam'],
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-20'),
  author: {
    id: 'author-1',
    name: 'Sheikh Ahmed Al-Rashid'
  },
  _count: {
    userProgress: 15,
    quizAttempts: 8
  },
  arabicContent: 'القرآن الكريم',
  transliteration: 'Al-Quran Al-Kareem',
  ...overrides
});

const createMockQuiz = (overrides = {}) => ({
  id: 'quiz-1',
  title: 'Islamic Knowledge Quiz',
  description: 'Test your understanding of basic Islamic principles',
  questions: [
    {
      id: 'q1',
      questionText: 'How many pillars of Islam are there?',
      questionType: QuestionType.MULTIPLE_CHOICE,
      options: [
        { id: 'opt1', text: '3', isCorrect: false },
        { id: 'opt2', text: '4', isCorrect: false },
        { id: 'opt3', text: '5', isCorrect: true },
        { id: 'opt4', text: '6', isCorrect: false }
      ],
      explanation: 'The five pillars of Islam are: Shahada, Salah, Zakat, Sawm, and Hajj.',
      points: 5,
      order: 1
    },
    {
      id: 'q2',
      questionText: 'The Quran was revealed in Arabic.',
      questionType: QuestionType.TRUE_FALSE,
      options: [
        { id: 'opt5', text: 'True', isCorrect: true },
        { id: 'opt6', text: 'False', isCorrect: false }
      ],
      explanation: 'The Quran was revealed in Arabic to Prophet Muhammad (ﷺ).',
      points: 3,
      order: 2
    }
  ],
  passingScore: 70,
  timeLimit: 600, // 10 minutes
  subject: IslamicSubject.AQIDAH,
  ageTier: AgeTier.YOUTH,
  difficultyLevel: DifficultyLevel.INTERMEDIATE,
  ...overrides
});

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('Education Component Integration Tests', () => {
  describe('EducationContentCard Component', () => {
    it('should render Islamic content with Arabic text', () => {
      const mockContent = createMockContent({
        arabicContent: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
        transliteration: 'Bismillahi Ar-Rahmani Ar-Raheem'
      });

      render(<EducationContentCard content={mockContent} />);

      expect(screen.getByText('Introduction to Quran')).toBeInTheDocument();
      expect(screen.getByText('Sheikh Ahmed Al-Rashid')).toBeInTheDocument();
      expect(screen.getByText('Arabic Content Available')).toBeInTheDocument();
      expect(screen.getByText('30 min')).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument(); // user count
    });

    it('should display age tier badge correctly', () => {
      const mockContent = createMockContent({ ageTier: AgeTier.CHILDREN });
      render(<EducationContentCard content={mockContent} />);

      const ageTierBadge = screen.getByText('Children');
      expect(ageTierBadge).toBeInTheDocument();
      expect(ageTierBadge.closest('.bg-blue-100')).toBeInTheDocument();
    });

    it('should show difficulty level with appropriate styling', () => {
      const mockContent = createMockContent({ difficultyLevel: DifficultyLevel.ADVANCED });
      render(<EducationContentCard content={mockContent} />);

      const difficultyBadge = screen.getByText('ADVANCED');
      expect(difficultyBadge).toBeInTheDocument();
      expect(difficultyBadge.closest('.bg-red-100')).toBeInTheDocument();
    });

    it('should display Islamic subject correctly', () => {
      const mockContent = createMockContent({ subject: IslamicSubject.HADITH });
      render(<EducationContentCard content={mockContent} />);

      expect(screen.getByText('Hadith')).toBeInTheDocument();
    });

    it('should show user progress when available', () => {
      const mockContent = createMockContent({
        userProgress: {
          id: 'progress-1',
          progress: 75,
          status: 'IN_PROGRESS',
          lastAccessed: new Date()
        }
      });

      render(<EducationContentCard content={mockContent} />);

      expect(screen.getByText('Progress:')).toBeInTheDocument();
      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('should handle click events correctly', () => {
      const mockContent = createMockContent();
      const onClickMock = jest.fn();

      render(<EducationContentCard content={mockContent} onClick={onClickMock} />);

      const card = screen.getByRole('article');
      fireEvent.click(card);

      expect(onClickMock).toHaveBeenCalledWith(mockContent);
    });

    it('should support keyboard navigation', () => {
      const mockContent = createMockContent();
      const onClickMock = jest.fn();

      render(<EducationContentCard content={mockContent} onClick={onClickMock} />);

      const card = screen.getByRole('article');
      fireEvent.keyDown(card, { key: 'Enter' });

      expect(onClickMock).toHaveBeenCalledWith(mockContent);
    });

    it('should display Islamic tags appropriately', () => {
      const mockContent = createMockContent({
        tags: ['quran', 'tafsir', 'arabic', 'tajweed']
      });

      render(<EducationContentCard content={mockContent} />);

      expect(screen.getByText('#quran')).toBeInTheDocument();
      expect(screen.getByText('#tafsir')).toBeInTheDocument();
      expect(screen.getByText('#arabic')).toBeInTheDocument();
      expect(screen.getByText('#tajweed')).toBeInTheDocument();
    });

    it('should format duration correctly for different time periods', () => {
      const shortContent = createMockContent({ estimatedDuration: 25 });
      const { rerender } = render(<EducationContentCard content={shortContent} />);
      expect(screen.getByText('25 min')).toBeInTheDocument();

      const longContent = createMockContent({ estimatedDuration: 90 });
      rerender(<EducationContentCard content={longContent} />);
      expect(screen.getByText('1h 30min')).toBeInTheDocument();

      const hourContent = createMockContent({ estimatedDuration: 120 });
      rerender(<EducationContentCard content={hourContent} />);
      expect(screen.getByText('2h')).toBeInTheDocument();
    });
  });

  describe('AgeTierFilter Component', () => {
    it('should render all age tiers with Islamic context', () => {
      const onTierChange = jest.fn();
      render(<AgeTierFilter onTierChange={onTierChange} />);

      expect(screen.getByText('Children')).toBeInTheDocument();
      expect(screen.getByText('Youth')).toBeInTheDocument();
      expect(screen.getByText('Adults')).toBeInTheDocument();
      expect(screen.getByText('Seniors')).toBeInTheDocument();
      expect(screen.getByText('All Ages')).toBeInTheDocument();

      // Check Islamic educational descriptions
      expect(screen.getByText('Basic Islamic stories, prayers, and moral values')).toBeInTheDocument();
      expect(screen.getByText('Islamic identity, contemporary issues, and guidance')).toBeInTheDocument();
    });

    it('should show content counts when provided', () => {
      const onTierChange = jest.fn();
      const contentCounts = {
        [AgeTier.CHILDREN]: 12,
        [AgeTier.YOUTH]: 8,
        [AgeTier.ADULTS]: 25,
        [AgeTier.SENIORS]: 5,
        [AgeTier.ALL_AGES]: 15
      };

      render(
        <AgeTierFilter 
          onTierChange={onTierChange} 
          showStats={true}
          contentCounts={contentCounts}
        />
      );

      expect(screen.getByText('12')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument();
    });

    it('should handle tier selection and clearing', () => {
      const onTierChange = jest.fn();
      render(<AgeTierFilter selectedTier={AgeTier.YOUTH} onTierChange={onTierChange} />);

      // Should show selected tier
      expect(screen.getByText('Currently showing:')).toBeInTheDocument();
      expect(screen.getByText('🧑 Youth')).toBeInTheDocument();

      // Should have clear button
      const clearButton = screen.getByText('Clear');
      fireEvent.click(clearButton);

      expect(onTierChange).toHaveBeenCalledWith(undefined);
    });

    it('should show learning focus when tier is selected', () => {
      const onTierChange = jest.fn();
      render(<AgeTierFilter selectedTier={AgeTier.CHILDREN} onTierChange={onTierChange} />);

      expect(screen.getByText('Learning Focus for Children')).toBeInTheDocument();
      expect(screen.getByText(/Focus on foundational Islamic concepts/)).toBeInTheDocument();
      expect(screen.getByText(/love for Allah, Prophet Muhammad/)).toBeInTheDocument();
    });

    it('should call onTierChange when tier is clicked', () => {
      const onTierChange = jest.fn();
      render(<AgeTierFilter onTierChange={onTierChange} />);

      const youthButton = screen.getByText('Youth').closest('button');
      fireEvent.click(youthButton!);

      expect(onTierChange).toHaveBeenCalledWith(AgeTier.YOUTH);
    });

    it('should apply appropriate styling for selected tier', () => {
      const onTierChange = jest.fn();
      render(<AgeTierFilter selectedTier={AgeTier.ADULTS} onTierChange={onTierChange} />);

      const adultButton = screen.getByText('Adults').closest('button');
      expect(adultButton).toHaveClass('border-islamic-green-500', 'bg-islamic-green-50');
    });
  });

  describe('QuizInterface Component', () => {
    it('should render quiz header with Islamic context', () => {
      const mockQuiz = createMockQuiz();
      render(<QuizInterface quiz={mockQuiz} />);

      expect(screen.getByText('Islamic Knowledge Quiz')).toBeInTheDocument();
      expect(screen.getByText('Test your understanding of basic Islamic principles')).toBeInTheDocument();
      expect(screen.getByText('🧑 Youth')).toBeInTheDocument(); // Age tier badge
      expect(screen.getByText('AQIDAH')).toBeInTheDocument(); // Subject badge
    });

    it('should display timer when time limit is set', () => {
      const mockQuiz = createMockQuiz({ timeLimit: 300 }); // 5 minutes
      render(<QuizInterface quiz={mockQuiz} />);

      expect(screen.getByText('5:00')).toBeInTheDocument();
    });

    it('should show current question with Islamic content', () => {
      const mockQuiz = createMockQuiz();
      render(<QuizInterface quiz={mockQuiz} />);

      expect(screen.getByText('How many pillars of Islam are there?')).toBeInTheDocument();
      expect(screen.getByText('5 points')).toBeInTheDocument();
      expect(screen.getByText('MULTIPLE CHOICE')).toBeInTheDocument();
    });

    it('should handle answer selection for multiple choice questions', async () => {
      const mockQuiz = createMockQuiz();
      render(<QuizInterface quiz={mockQuiz} />);

      const correctOption = screen.getByLabelText('5');
      fireEvent.click(correctOption);

      expect(correctOption).toBeChecked();
    });

    it('should navigate between questions', async () => {
      const mockQuiz = createMockQuiz();
      render(<QuizInterface quiz={mockQuiz} />);

      // Should start at question 1
      expect(screen.getByText('Question 1 of 2')).toBeInTheDocument();
      expect(screen.getByText('How many pillars of Islam are there?')).toBeInTheDocument();

      // Navigate to next question
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('Question 2 of 2')).toBeInTheDocument();
        expect(screen.getByText('The Quran was revealed in Arabic.')).toBeInTheDocument();
      });
    });

    it('should show progress indicator', () => {
      const mockQuiz = createMockQuiz();
      render(<QuizInterface quiz={mockQuiz} />);

      expect(screen.getByText('Question 1 of 2')).toBeInTheDocument();
      expect(screen.getByText('Answered: 0 of 2')).toBeInTheDocument();

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toBeInTheDocument();
    });

    it('should handle quiz submission', async () => {
      const onComplete = jest.fn();
      const mockQuiz = createMockQuiz();
      render(<QuizInterface quiz={mockQuiz} onComplete={onComplete} />);

      // Answer first question
      const firstAnswer = screen.getByLabelText('5');
      fireEvent.click(firstAnswer);

      // Go to next question
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);

      // Answer second question
      await waitFor(() => {
        const secondAnswer = screen.getByLabelText('True');
        fireEvent.click(secondAnswer);
      });

      // Submit quiz
      const submitButton = screen.getByText('Submit Quiz');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(onComplete).toHaveBeenCalledWith(
          expect.objectContaining({
            score: 100,
            totalQuestions: 2,
            correctAnswers: 2,
            passed: true
          })
        );
      });
    });

    it('should display quiz results with Islamic congratulations', async () => {
      const mockQuiz = createMockQuiz();
      render(<QuizInterface quiz={mockQuiz} />);

      // Complete quiz
      const firstAnswer = screen.getByLabelText('5');
      fireEvent.click(firstAnswer);

      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);

      await waitFor(() => {
        const secondAnswer = screen.getByLabelText('True');
        fireEvent.click(secondAnswer);
      });

      const submitButton = screen.getByText('Submit Quiz');
      fireEvent.click(submitButton);

      // Should show results
      await waitFor(() => {
        expect(screen.getByText('Quiz Completed!')).toBeInTheDocument();
        expect(screen.getByText('100%')).toBeInTheDocument(); // Final score
        expect(screen.getByText('2')).toBeInTheDocument(); // Correct answers
        expect(screen.getByText('PASS')).toBeInTheDocument();
      });
    });

    it('should show detailed answer review with explanations', async () => {
      const mockQuiz = createMockQuiz();
      render(<QuizInterface quiz={mockQuiz} />);

      // Complete quiz with one wrong answer
      const wrongAnswer = screen.getByLabelText('4');
      fireEvent.click(wrongAnswer);

      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);

      await waitFor(() => {
        const correctAnswer = screen.getByLabelText('True');
        fireEvent.click(correctAnswer);
      });

      const submitButton = screen.getByText('Submit Quiz');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Review Your Answers')).toBeInTheDocument();
        
        // Check for explanations
        const showExplanationButton = screen.getByText('Show Explanation');
        fireEvent.click(showExplanationButton);
        
        expect(screen.getByText(/The five pillars of Islam are/)).toBeInTheDocument();
      });
    });

    it('should handle true/false questions correctly', async () => {
      const mockQuiz = createMockQuiz();
      render(<QuizInterface quiz={mockQuiz} />);

      // Navigate to true/false question
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('The Quran was revealed in Arabic.')).toBeInTheDocument();
        expect(screen.getByText('TRUE FALSE')).toBeInTheDocument();
        
        // Should have radio buttons for True/False
        const trueOption = screen.getByLabelText('True');
        const falseOption = screen.getByLabelText('False');
        
        expect(trueOption).toBeInTheDocument();
        expect(falseOption).toBeInTheDocument();
      });
    });

    it('should allow quiz retaking', async () => {
      const onRetake = jest.fn();
      const mockQuiz = createMockQuiz();
      render(<QuizInterface quiz={mockQuiz} onRetake={onRetake} />);

      // Complete quiz first
      const firstAnswer = screen.getByLabelText('5');
      fireEvent.click(firstAnswer);

      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);

      await waitFor(() => {
        const secondAnswer = screen.getByLabelText('True');
        fireEvent.click(secondAnswer);
      });

      const submitButton = screen.getByText('Submit Quiz');
      fireEvent.click(submitButton);

      // Click retake
      await waitFor(() => {
        const retakeButton = screen.getByText('Retake Quiz');
        fireEvent.click(retakeButton);
      });

      expect(onRetake).toHaveBeenCalled();
      
      // Should return to first question
      await waitFor(() => {
        expect(screen.getByText('How many pillars of Islam are there?')).toBeInTheDocument();
        expect(screen.getByText('Question 1 of 2')).toBeInTheDocument();
      });
    });

    it('should show warning for multiple correct answers', () => {
      const multiSelectQuiz = createMockQuiz({
        questions: [{
          id: 'q1',
          questionText: 'Which of the following are pillars of Islam? (Select all that apply)',
          questionType: QuestionType.MULTIPLE_CHOICE,
          options: [
            { id: 'opt1', text: 'Shahada', isCorrect: true },
            { id: 'opt2', text: 'Salah', isCorrect: true },
            { id: 'opt3', text: 'Fasting in Ramadan only', isCorrect: false },
            { id: 'opt4', text: 'Zakat', isCorrect: true }
          ],
          explanation: 'Shahada, Salah, Zakat, Sawm, and Hajj are the five pillars.',
          points: 10,
          order: 1
        }]
      });

      render(<QuizInterface quiz={multiSelectQuiz} />);

      expect(screen.getByText(/This question has multiple correct answers/)).toBeInTheDocument();
      expect(screen.getByText(/Select all that apply/)).toBeInTheDocument();
    });
  });

  describe('Component Integration Tests', () => {
    it('should integrate age tier filtering with content display', () => {
      const mockContents = [
        createMockContent({ ageTier: AgeTier.CHILDREN, title: 'Children Stories' }),
        createMockContent({ ageTier: AgeTier.YOUTH, title: 'Youth Guidance' }),
        createMockContent({ ageTier: AgeTier.ALL_AGES, title: 'Universal Teachings' })
      ];

      const TestComponent = () => {
        const [selectedTier, setSelectedTier] = React.useState<AgeTier | undefined>();
        
        const filteredContent = mockContents.filter(content => 
          !selectedTier || content.ageTier === selectedTier || content.ageTier === AgeTier.ALL_AGES
        );

        return (
          <div>
            <AgeTierFilter selectedTier={selectedTier} onTierChange={setSelectedTier} />
            <div data-testid="content-list">
              {filteredContent.map(content => (
                <EducationContentCard key={content.id} content={content} />
              ))}
            </div>
          </div>
        );
      };

      render(<TestComponent />);

      // Initially should show all content
      expect(screen.getByText('Children Stories')).toBeInTheDocument();
      expect(screen.getByText('Youth Guidance')).toBeInTheDocument();
      expect(screen.getByText('Universal Teachings')).toBeInTheDocument();

      // Filter by children
      const childrenButton = screen.getByText('Children').closest('button');
      fireEvent.click(childrenButton!);

      // Should only show children and all-ages content
      expect(screen.getByText('Children Stories')).toBeInTheDocument();
      expect(screen.queryByText('Youth Guidance')).not.toBeInTheDocument();
      expect(screen.getByText('Universal Teachings')).toBeInTheDocument();
    });

    it('should handle accessibility features across all components', () => {
      const mockContent = createMockContent();
      const mockQuiz = createMockQuiz();
      
      render(
        <div>
          <EducationContentCard content={mockContent} />
          <QuizInterface quiz={mockQuiz} />
        </div>
      );

      // Check ARIA labels and roles
      expect(screen.getByRole('article')).toBeInTheDocument();
      expect(screen.getByLabelText(/Islamic educational content/)).toBeInTheDocument();
      
      // Check keyboard navigation
      const card = screen.getByRole('article');
      expect(card).toHaveAttribute('tabIndex', '0');
      
      // Check form accessibility in quiz
      const radioButtons = screen.getAllByRole('radio');
      expect(radioButtons.length).toBeGreaterThan(0);
      
      radioButtons.forEach(radio => {
        expect(radio).toHaveAttribute('id');
      });
    });

    it('should maintain Islamic context throughout user interactions', async () => {
      const mockQuiz = createMockQuiz({
        title: 'Seerah Quiz',
        description: 'Learn about Prophet Muhammad (ﷺ)',
        subject: IslamicSubject.SEERAH
      });

      render(<QuizInterface quiz={mockQuiz} />);

      // Islamic context in header
      expect(screen.getByText('Seerah Quiz')).toBeInTheDocument();
      expect(screen.getByText('Learn about Prophet Muhammad (ﷺ)')).toBeInTheDocument();
      expect(screen.getByText('SEERAH')).toBeInTheDocument();

      // Complete quiz to see results context
      const firstAnswer = screen.getByLabelText('5');
      fireEvent.click(firstAnswer);

      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);

      await waitFor(() => {
        const secondAnswer = screen.getByLabelText('True');
        fireEvent.click(secondAnswer);
      });

      const submitButton = screen.getByText('Submit Quiz');
      fireEvent.click(submitButton);

      // Islamic context maintained in results
      await waitFor(() => {
        expect(screen.getByText('Seerah Quiz')).toBeInTheDocument();
        expect(screen.getByText('🧑 Youth')).toBeInTheDocument();
        expect(screen.getByText('SEERAH')).toBeInTheDocument();
      });
    });
  });
});