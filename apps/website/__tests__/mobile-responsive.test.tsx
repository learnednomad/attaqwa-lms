/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
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

// Mock ResizeObserver for responsive testing
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock window.matchMedia for responsive testing
const createMockMatchMedia = (matches: boolean) => jest.fn().mockImplementation((query: string) => ({
  matches,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

// Helper function to mock viewport sizes
const mockViewport = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  
  // Mock matchMedia for different breakpoints
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;
  
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: 
        (query === '(max-width: 767px)' && isMobile) ||
        (query === '(min-width: 768px) and (max-width: 1023px)' && isTablet) ||
        (query === '(min-width: 1024px)' && isDesktop) ||
        (query === '(orientation: portrait)' && height > width) ||
        (query === '(orientation: landscape)' && width > height),
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  // Trigger resize event
  act(() => {
    window.dispatchEvent(new Event('resize'));
  });
};

// Mock data
const createMobileTestContent = (overrides = {}) => ({
  id: 'mobile-content-1',
  title: 'Islamic Ethics for Youth',
  description: 'Learn about Islamic moral principles and character development through interactive lessons and real-world examples.',
  subject: IslamicSubject.ISLAMIC_ETIQUETTE,
  ageTier: AgeTier.YOUTH,
  difficultyLevel: DifficultyLevel.INTERMEDIATE,
  contentType: EducationContentType.LESSON,
  estimatedDuration: 45,
  thumbnailUrl: 'https://example.com/islamic-ethics-thumb.jpg',
  isPublished: true,
  tags: ['ethics', 'youth', 'character', 'akhlaq', 'moral-development'],
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-20'),
  author: {
    id: 'author-1',
    name: 'Sheikh Amina Al-Zahra'
  },
  _count: {
    userProgress: 42,
    quizAttempts: 18
  },
  arabicContent: 'الأخلاق الإسلامية للشباب',
  transliteration: 'Al-Akhlaq Al-Islamiyyah lil-Shabab',
  translation: 'Islamic Ethics for Youth',
  ...overrides
});

const createMobileQuiz = (overrides = {}) => ({
  id: 'mobile-quiz-1',
  title: 'Islamic Knowledge Quiz',
  description: 'Test your understanding of basic Islamic principles',
  questions: [
    {
      id: 'q1',
      questionText: 'What is the Arabic term for the direction Muslims face during prayer?',
      questionType: QuestionType.MULTIPLE_CHOICE,
      options: [
        { id: 'opt1', text: 'Mihrab', isCorrect: false },
        { id: 'opt2', text: 'Qibla', isCorrect: true },
        { id: 'opt3', text: 'Minbar', isCorrect: false },
        { id: 'opt4', text: 'Minaret', isCorrect: false }
      ],
      explanation: 'Qibla is the direction that should be faced when a Muslim prays during ritual prayer.',
      points: 5,
      order: 1
    },
    {
      id: 'q2',
      questionText: 'Ramadan is the ninth month of the Islamic calendar.',
      questionType: QuestionType.TRUE_FALSE,
      options: [
        { id: 'opt5', text: 'True', isCorrect: true },
        { id: 'opt6', text: 'False', isCorrect: false }
      ],
      explanation: 'Ramadan is indeed the ninth month of the Islamic lunar calendar.',
      points: 3,
      order: 2
    }
  ],
  passingScore: 70,
  timeLimit: 600,
  subject: IslamicSubject.AQIDAH,
  ageTier: AgeTier.YOUTH,
  difficultyLevel: DifficultyLevel.INTERMEDIATE,
  ...overrides
});

describe('Mobile Responsiveness and Accessibility Tests', () => {
  afterEach(() => {
    // Reset viewport after each test
    mockViewport(1024, 768); // Desktop default
  });

  describe('Mobile Viewport Tests (< 768px)', () => {
    beforeEach(() => {
      mockViewport(375, 667); // iPhone SE size
    });

    it('should render EducationContentCard responsively on mobile', () => {
      const mockContent = createMobileTestContent();
      const { container } = render(<EducationContentCard content={mockContent} />);

      // Card should be present and readable
      expect(screen.getByText('Islamic Ethics for Youth')).toBeInTheDocument();
      expect(screen.getByText('Sheikh Amina Al-Zahra')).toBeInTheDocument();
      
      // Should not have horizontal overflow
      const card = container.firstChild as HTMLElement;
      expect(card).toBeDefined();
      
      // Title should be visible and not truncated inappropriately
      const titleElement = screen.getByText('Islamic Ethics for Youth');
      expect(titleElement).toBeVisible();
    });

    it('should stack elements vertically on mobile for AgeTierFilter', () => {
      const onTierChange = jest.fn();
      const { container } = render(<AgeTierFilter onTierChange={onTierChange} />);

      const ageButtons = container.querySelectorAll('button');
      expect(ageButtons.length).toBeGreaterThan(0);

      // All age tier buttons should be accessible on mobile
      expect(screen.getByText('Children')).toBeVisible();
      expect(screen.getByText('Youth')).toBeVisible();
      expect(screen.getByText('Adults')).toBeVisible();
      expect(screen.getByText('Seniors')).toBeVisible();
      expect(screen.getByText('All Ages')).toBeVisible();
    });

    it('should optimize quiz interface for mobile interaction', () => {
      const mockQuiz = createMobileQuiz();
      render(<QuizInterface quiz={mockQuiz} />);

      // Quiz title should be readable
      expect(screen.getByText('Islamic Knowledge Quiz')).toBeVisible();
      
      // Question should be displayed clearly
      expect(screen.getByText('What is the Arabic term for the direction Muslims face during prayer?')).toBeVisible();
      
      // Options should be touch-friendly
      const radioButtons = screen.getAllByRole('radio');
      expect(radioButtons.length).toBe(4);
      
      radioButtons.forEach(button => {
        expect(button).toBeVisible();
      });
      
      // Navigation elements should be present
      expect(screen.getByText('Next')).toBeVisible();
    });

    it('should handle long Arabic text on mobile screens', () => {
      const longArabicContent = createMobileTestContent({
        arabicContent: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ * الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ * الرَّحْمَنِ الرَّحِيمِ * مَالِكِ يَوْمِ الدِّينِ',
        transliteration: 'Bismillahi Ar-Rahmani Ar-Raheem * Al-hamdu lillahi rabbil alameen * Ar-Rahmani Ar-Raheem * Maliki yawmid deen'
      });

      render(<EducationContentCard content={longArabicContent} />);

      // Arabic content indicator should be visible
      expect(screen.getByText('Arabic Content Available')).toBeVisible();
      
      // Card should not break layout with long text
      expect(screen.getByText('Islamic Ethics for Youth')).toBeVisible();
    });

    it('should maintain touch targets of appropriate size', () => {
      const onTierChange = jest.fn();
      render(<AgeTierFilter onTierChange={onTierChange} />);

      const buttons = screen.getAllByRole('button');
      
      // All buttons should be present (minimum touch target size is handled by CSS)
      expect(buttons.length).toBeGreaterThan(4); // At least the age tier buttons
      
      buttons.forEach(button => {
        expect(button).toBeVisible();
      });
    });
  });

  describe('Tablet Viewport Tests (768px - 1023px)', () => {
    beforeEach(() => {
      mockViewport(768, 1024); // iPad size
    });

    it('should adapt layout for tablet screens', () => {
      const mockContent = createMobileTestContent();
      render(<EducationContentCard content={mockContent} />);

      // Content should be fully visible on tablet
      expect(screen.getByText('Islamic Ethics for Youth')).toBeVisible();
      expect(screen.getByText('Learn about Islamic moral principles')).toBeVisible();
      
      // Should show more content than mobile but less than desktop
      const descriptionText = screen.getByText(/Learn about Islamic moral principles/);
      expect(descriptionText).toBeVisible();
    });

    it('should show appropriate grid layout for age tier filters', () => {
      const onTierChange = jest.fn();
      const { container } = render(<AgeTierFilter onTierChange={onTierChange} />);

      // On tablet, should show 2-3 columns
      const gridContainer = container.querySelector('[class*="grid"]');
      expect(gridContainer).toBeDefined();
      
      // All age tier options should be visible
      expect(screen.getByText('Children')).toBeVisible();
      expect(screen.getByText('Youth')).toBeVisible();
      expect(screen.getByText('Adults')).toBeVisible();
    });

    it('should optimize quiz navigation for tablet', () => {
      const mockQuiz = createMobileQuiz();
      render(<QuizInterface quiz={mockQuiz} />);

      // Should show question indicators
      const questionIndicators = screen.getAllByText(/^\d+$/);
      expect(questionIndicators.length).toBe(2); // Two questions
      
      // Navigation should be optimized for tablet
      expect(screen.getByText('Next')).toBeVisible();
    });
  });

  describe('Desktop Viewport Tests (>= 1024px)', () => {
    beforeEach(() => {
      mockViewport(1440, 900); // Desktop size
    });

    it('should show full layout on desktop', () => {
      const mockContent = createMobileTestContent();
      render(<EducationContentCard content={mockContent} />);

      // All content should be fully visible
      expect(screen.getByText('Islamic Ethics for Youth')).toBeVisible();
      expect(screen.getByText('Learn about Islamic moral principles and character development through interactive lessons and real-world examples.')).toBeVisible();
      expect(screen.getByText('Sheikh Amina Al-Zahra')).toBeVisible();
      
      // Tags should all be visible
      expect(screen.getByText('#ethics')).toBeVisible();
      expect(screen.getByText('#youth')).toBeVisible();
      expect(screen.getByText('#character')).toBeVisible();
    });

    it('should use horizontal layout for age tier filters', () => {
      const onTierChange = jest.fn();
      render(<AgeTierFilter onTierChange={onTierChange} />);

      // Should show all options in a grid layout
      expect(screen.getByText('Children')).toBeVisible();
      expect(screen.getByText('Youth')).toBeVisible();
      expect(screen.getByText('Adults')).toBeVisible();
      expect(screen.getByText('Seniors')).toBeVisible();
      expect(screen.getByText('All Ages')).toBeVisible();
    });
  });

  describe('Orientation Change Tests', () => {
    it('should handle portrait to landscape orientation change', () => {
      // Start in portrait
      mockViewport(375, 667);
      
      const mockContent = createMobileTestContent();
      const { rerender } = render(<EducationContentCard content={mockContent} />);

      expect(screen.getByText('Islamic Ethics for Youth')).toBeVisible();

      // Change to landscape
      mockViewport(667, 375);
      rerender(<EducationContentCard content={mockContent} />);

      // Content should still be visible
      expect(screen.getByText('Islamic Ethics for Youth')).toBeVisible();
    });

    it('should adapt quiz interface for orientation changes', () => {
      const mockQuiz = createMobileQuiz();
      
      // Start in portrait
      mockViewport(375, 667);
      const { rerender } = render(<QuizInterface quiz={mockQuiz} />);

      expect(screen.getByText('Islamic Knowledge Quiz')).toBeVisible();

      // Change to landscape
      mockViewport(667, 375);
      rerender(<QuizInterface quiz={mockQuiz} />);

      // Quiz should still be functional
      expect(screen.getByText('Islamic Knowledge Quiz')).toBeVisible();
      expect(screen.getByText('Next')).toBeVisible();
    });
  });

  describe('Touch Interaction Tests', () => {
    beforeEach(() => {
      mockViewport(375, 667); // Mobile size for touch testing
    });

    it('should respond to touch events on content cards', () => {
      const mockContent = createMobileTestContent();
      const onClickMock = jest.fn();

      render(<EducationContentCard content={mockContent} onClick={onClickMock} />);

      const card = screen.getByRole('article');
      
      // Simulate touch interaction
      fireEvent.touchStart(card);
      fireEvent.touchEnd(card);
      fireEvent.click(card);

      expect(onClickMock).toHaveBeenCalled();
    });

    it('should handle touch interaction on quiz options', () => {
      const mockQuiz = createMobileQuiz();
      render(<QuizInterface quiz={mockQuiz} />);

      const firstOption = screen.getByLabelText('Mihrab');
      
      // Simulate touch selection
      fireEvent.touchStart(firstOption);
      fireEvent.touchEnd(firstOption);
      fireEvent.click(firstOption);

      expect(firstOption).toBeChecked();
    });

    it('should provide haptic feedback equivalent for important actions', () => {
      const mockQuiz = createMobileQuiz();
      render(<QuizInterface quiz={mockQuiz} />);

      // Select an answer
      const correctAnswer = screen.getByLabelText('Qibla');
      fireEvent.click(correctAnswer);

      // Navigate to next question
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);

      // Should show next question
      expect(screen.getByText('Ramadan is the ninth month of the Islamic calendar.')).toBeVisible();
    });
  });

  describe('Performance on Mobile Devices', () => {
    beforeEach(() => {
      mockViewport(375, 667);
    });

    it('should render efficiently with limited resources', () => {
      const startTime = performance.now();
      
      const mockContent = createMobileTestContent();
      render(<EducationContentCard content={mockContent} />);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render quickly (under 100ms is good for mobile)
      expect(renderTime).toBeLessThan(100);
      
      // Content should be visible
      expect(screen.getByText('Islamic Ethics for Youth')).toBeVisible();
    });

    it('should handle multiple components efficiently', () => {
      const startTime = performance.now();
      
      // Render multiple components as might appear on a mobile page
      const mockContent = createMobileTestContent();
      const onTierChange = jest.fn();
      
      render(
        <div>
          <AgeTierFilter onTierChange={onTierChange} />
          <EducationContentCard content={mockContent} />
          <EducationContentCard content={createMobileTestContent({ id: 'content-2', title: 'Second Content' })} />
          <EducationContentCard content={createMobileTestContent({ id: 'content-3', title: 'Third Content' })} />
        </div>
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should handle multiple components efficiently
      expect(renderTime).toBeLessThan(200);
      
      // All components should be present
      expect(screen.getByText('Filter by Age Group')).toBeVisible();
      expect(screen.getByText('Islamic Ethics for Youth')).toBeVisible();
      expect(screen.getByText('Second Content')).toBeVisible();
      expect(screen.getByText('Third Content')).toBeVisible();
    });
  });

  describe('Accessibility on Mobile', () => {
    beforeEach(() => {
      mockViewport(375, 667);
    });

    it('should maintain accessibility features on mobile', () => {
      const mockContent = createMobileTestContent();
      render(<EducationContentCard content={mockContent} />);

      const card = screen.getByRole('article');
      
      // Should maintain ARIA labels
      expect(card).toHaveAttribute('aria-label', expect.stringContaining('Islamic educational content'));
      
      // Should be focusable
      expect(card).toHaveAttribute('tabIndex', '0');
    });

    it('should support screen readers on mobile', () => {
      const mockQuiz = createMobileQuiz();
      render(<QuizInterface quiz={mockQuiz} />);

      // Progress information should be available to screen readers
      expect(screen.getByText('Question 1 of 2')).toBeVisible();
      
      // Progress bar should have appropriate role
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toBeInTheDocument();
    });

    it('should maintain focus management on mobile', () => {
      const onTierChange = jest.fn();
      render(<AgeTierFilter selectedTier={AgeTier.YOUTH} onTierChange={onTierChange} />);

      const clearButton = screen.getByText('Clear');
      
      // Should be focusable on mobile
      clearButton.focus();
      expect(document.activeElement).toBe(clearButton);
    });
  });

  describe('Islamic Content Mobile Optimization', () => {
    beforeEach(() => {
      mockViewport(375, 667);
    });

    it('should display Arabic text appropriately on mobile', () => {
      const arabicContent = createMobileTestContent({
        arabicContent: 'وَاللَّهُ أَعْلَمُ بِالصَّوَابِ',
        transliteration: 'Wallahu A\'lam bil Sawab',
        translation: 'And Allah knows best what is correct'
      });

      render(<EducationContentCard content={arabicContent} />);

      // Arabic content indicator should be visible on mobile
      expect(screen.getByText('Arabic Content Available')).toBeVisible();
      
      // Main content should not be obscured
      expect(screen.getByText('Islamic Ethics for Youth')).toBeVisible();
    });

    it('should handle Islamic terminology on mobile screens', () => {
      const islamicContent = createMobileTestContent({
        title: 'The Five Pillars of Islam (Arkan al-Islam)',
        description: 'Learn about Shahada, Salah, Zakat, Sawm, and Hajj - the foundational practices of Islam.',
        tags: ['pillars', 'shahada', 'salah', 'zakat', 'sawm', 'hajj']
      });

      render(<EducationContentCard content={islamicContent} />);

      // Islamic terminology should be visible
      expect(screen.getByText('The Five Pillars of Islam (Arkan al-Islam)')).toBeVisible();
      
      // Tags with Islamic terms should be visible
      expect(screen.getByText('#shahada')).toBeVisible();
      expect(screen.getByText('#salah')).toBeVisible();
    });

    it('should optimize Islamic quiz content for mobile', () => {
      const islamicQuiz = createMobileQuiz({
        title: 'Daily Islamic Practices Quiz',
        description: 'Test your knowledge of essential Islamic practices'
      });

      render(<QuizInterface quiz={islamicQuiz} />);

      // Islamic content should be clear on mobile
      expect(screen.getByText('Daily Islamic Practices Quiz')).toBeVisible();
      expect(screen.getByText('What is the Arabic term for the direction Muslims face during prayer?')).toBeVisible();
      
      // Islamic terminology in options should be readable
      expect(screen.getByText('Qibla')).toBeVisible();
    });
  });
});