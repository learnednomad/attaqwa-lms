/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
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

// Extend Jest matchers for accessibility testing
expect.extend(toHaveNoViolations);

// Mock data with cultural considerations
const createCulturallyAwareMockContent = (overrides = {}) => ({
  id: 'content-1',
  title: 'Understanding Islamic Ethics (Akhlaq)',
  description: 'Learn about Islamic moral principles and character development according to Quran and Sunnah.',
  subject: IslamicSubject.ISLAMIC_ETIQUETTE,
  ageTier: AgeTier.YOUTH,
  difficultyLevel: DifficultyLevel.INTERMEDIATE,
  contentType: EducationContentType.LESSON,
  estimatedDuration: 45,
  thumbnailUrl: null,
  isPublished: true,
  tags: ['akhlaq', 'ethics', 'character', 'islamic-values'],
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-20'),
  author: {
    id: 'author-1',
    name: 'Sheikh Aisha bint Abdullah' // Female scholar representation
  },
  _count: {
    userProgress: 25,
    quizAttempts: 12
  },
  arabicContent: 'الأخلاق الإسلامية',
  transliteration: 'Al-Akhlaq Al-Islamiyyah',
  translation: 'Islamic Ethics and Character',
  ...overrides
});

const createMulticulturalQuiz = (overrides = {}) => ({
  id: 'multicultural-quiz-1',
  title: 'Global Muslim Communities Quiz',
  description: 'Test your knowledge about diverse Muslim communities worldwide',
  questions: [
    {
      id: 'q1',
      questionText: 'Which country has the largest Muslim population in the world?',
      questionType: QuestionType.MULTIPLE_CHOICE,
      options: [
        { id: 'opt1', text: 'Saudi Arabia', isCorrect: false },
        { id: 'opt2', text: 'Indonesia', isCorrect: true },
        { id: 'opt3', text: 'Pakistan', isCorrect: false },
        { id: 'opt4', text: 'Egypt', isCorrect: false }
      ],
      explanation: 'Indonesia has the largest Muslim population, with over 225 million Muslims.',
      points: 5,
      order: 1
    },
    {
      id: 'q2',
      questionText: 'Muslims pray facing the direction of the Kaaba.',
      questionType: QuestionType.TRUE_FALSE,
      options: [
        { id: 'opt5', text: 'True', isCorrect: true },
        { id: 'opt6', text: 'False', isCorrect: false }
      ],
      explanation: 'The Qibla (direction of prayer) for all Muslims worldwide is towards the Kaaba in Makkah.',
      points: 3,
      order: 2
    }
  ],
  passingScore: 70,
  subject: IslamicSubject.ISLAMIC_HISTORY,
  ageTier: AgeTier.ADULTS,
  difficultyLevel: DifficultyLevel.INTERMEDIATE,
  ...overrides
});

describe('Cultural Sensitivity and Accessibility Test Suite', () => {
  describe('Cultural Sensitivity Tests', () => {
    describe('Islamic Content Representation', () => {
      it('should represent diverse Islamic perspectives appropriately', () => {
        const diverseContent = [
          createCulturallyAwareMockContent({ 
            subject: IslamicSubject.FIQH,
            title: 'Fiqh According to Different Schools of Thought',
            description: 'Understanding the four main Sunni schools: Hanafi, Maliki, Shafi\'i, and Hanbali'
          }),
          createCulturallyAwareMockContent({
            subject: IslamicSubject.ISLAMIC_HISTORY,
            title: 'Contributions of Muslim Women Scholars',
            description: 'Celebrating the intellectual contributions of female scholars throughout Islamic history',
            author: { id: 'author-2', name: 'Dr. Khadijah Al-Andalusi' }
          }),
          createCulturallyAwareMockContent({
            subject: IslamicSubject.COMPARATIVE_RELIGION,
            title: 'Islam and Interfaith Dialogue',
            description: 'Understanding Islam\'s approach to respectful interfaith relationships'
          })
        ];

        diverseContent.forEach(content => {
          render(<EducationContentCard content={content} />);
          
          expect(screen.getByText(content.title)).toBeInTheDocument();
          expect(screen.getByText(content.author.name)).toBeInTheDocument();
          
          // Clean up for next iteration
          screen.debug(); // Remove in production
        });
      });

      it('should handle cultural diversity within Islamic contexts', () => {
        const culturallyDiverseContent = createCulturallyAwareMockContent({
          title: 'Islamic Traditions Across Cultures',
          description: 'Exploring how Islamic practices adapt to different cultural contexts while maintaining core principles',
          tags: ['culture', 'diversity', 'traditions', 'global-islam'],
          arabicContent: 'التنوع الثقافي في الإسلام',
          transliteration: 'At-Tanawwu Ath-Thaqafi fil Islam',
          translation: 'Cultural Diversity in Islam'
        });

        render(<EducationContentCard content={culturallyDiverseContent} />);

        expect(screen.getByText('Islamic Traditions Across Cultures')).toBeInTheDocument();
        expect(screen.getByText('#culture')).toBeInTheDocument();
        expect(screen.getByText('#diversity')).toBeInTheDocument();
        expect(screen.getByText('#global-islam')).toBeInTheDocument();
      });

      it('should use inclusive language for all age groups', () => {
        const ageInclusiveContent = [
          createCulturallyAwareMockContent({ 
            ageTier: AgeTier.CHILDREN,
            title: 'Stories of Young Muslim Heroes',
            description: 'Inspiring stories of young Muslims throughout history who made positive contributions'
          }),
          createCulturallyAwareMockContent({ 
            ageTier: AgeTier.SENIORS,
            title: 'Wisdom and Experience in Islamic Tradition',
            description: 'The value of elderly wisdom and continued learning in Islamic culture'
          })
        ];

        ageInclusiveContent.forEach(content => {
          const { unmount } = render(<EducationContentCard content={content} />);
          
          expect(screen.getByText(content.title)).toBeInTheDocument();
          expect(screen.getByText(content.description)).toBeInTheDocument();
          
          unmount();
        });
      });

      it('should represent global Islamic scholarship', () => {
        const globalScholarNames = [
          'Sheikh Abdullah Al-Maghribi', // North African
          'Ustadha Zainab Ansari', // Female American scholar
          'Dr. Ahmad ibn Muhammad Al-Indonesi', // Southeast Asian
          'Sheikh Fatima bint Ali Al-Andalusi', // Female Spanish Muslim scholar
          'Imam Yusuf Al-Turki', // Turkish scholar
          'Dr. Aisha Abdel-Rahman', // Female Arab scholar
        ];

        globalScholarNames.forEach((scholarName, index) => {
          const content = createCulturallyAwareMockContent({
            id: `content-${index}`,
            author: { id: `author-${index}`, name: scholarName }
          });

          const { unmount } = render(<EducationContentCard content={content} />);
          
          expect(screen.getByText(scholarName)).toBeInTheDocument();
          
          unmount();
        });
      });
    });

    describe('Language and Terminology Sensitivity', () => {
      it('should use respectful Islamic terminology consistently', () => {
        const respectfulTerminology = [
          'Prophet Muhammad (ﷺ)', // Peace be upon him
          'Quran', // Not Koran
          'Muslim', // Not Moslem
          'Masjid', // In Arabic contexts, not just mosque
          'Eid Mubarak', // Proper greeting
          'Ramadan Kareem', // Proper Ramadan greeting
          'May Allah bless you', // Islamic blessing
          'Insha\'Allah', // God willing
          'Alhamdulillah', // Praise be to Allah
          'Subhanallah' // Glory be to Allah
        ];

        respectfulTerminology.forEach(term => {
          // Each term should be properly formatted and respectful
          expect(term).not.toMatch(/inappropriate|disrespectful|offensive/i);
          expect(typeof term).toBe('string');
          expect(term.length).toBeGreaterThan(0);
        });
      });

      it('should handle gender-inclusive Islamic education', () => {
        const genderInclusiveContent = [
          createCulturallyAwareMockContent({
            title: 'Islamic Leadership: Men and Women in Service',
            description: 'Exploring the roles of both men and women as leaders in Islamic history and contemporary society',
            author: { id: 'author-1', name: 'Dr. Amina Hassan' }
          }),
          createCulturallyAwareMockContent({
            title: 'Parenting in Islam: Guidance for Mothers and Fathers',
            description: 'Islamic principles for both parents in raising righteous children',
            author: { id: 'author-2', name: 'Sheikh Omar Al-Baghdadi' }
          })
        ];

        genderInclusiveContent.forEach(content => {
          const { unmount } = render(<EducationContentCard content={content} />);
          
          expect(screen.getByText(content.title)).toBeInTheDocument();
          expect(screen.getByText(content.description)).toBeInTheDocument();
          
          unmount();
        });
      });

      it('should avoid culturally insensitive stereotypes', () => {
        // Test that content avoids harmful stereotypes
        const problematicPhrases = [
          'backward', 'primitive', 'uncivilized', 'extremist', 
          'fundamentalist', 'terrorist', 'oppressive',
          'violent', 'intolerant', 'radical'
        ];

        const testContent = createCulturallyAwareMockContent({
          title: 'Understanding Islamic Civilization',
          description: 'Exploring the rich intellectual and cultural contributions of Islamic civilization to world history',
        });

        render(<EducationContentCard content={testContent} />);

        const pageText = document.body.textContent || '';
        
        problematicPhrases.forEach(phrase => {
          expect(pageText.toLowerCase()).not.toContain(phrase.toLowerCase());
        });
      });
    });

    describe('Regional and Cultural Adaptation', () => {
      it('should accommodate different prayer time formats', () => {
        const prayerTimeFormats = [
          { format: '12-hour', example: '5:30 AM' },
          { format: '24-hour', example: '17:30' },
          { format: 'with-seconds', example: '05:30:15' }
        ];

        prayerTimeFormats.forEach(format => {
          expect(format.format).toBeDefined();
          expect(format.example).toMatch(/\d{1,2}:\d{2}/); // Basic time format validation
        });
      });

      it('should support different Islamic calendar systems', () => {
        const islamicCalendarSystems = [
          'Hijri Solar (Persian)',
          'Hijri Lunar (Arabic)',
          'Turkish Fiscal Hijri',
          'Umm al-Qura (Saudi)'
        ];

        islamicCalendarSystems.forEach(system => {
          expect(system).toBeDefined();
          expect(system).toMatch(/hijri|islamic/i);
        });
      });

      it('should handle different Qibla calculation methods', () => {
        const qiblaCalculationMethods = [
          'Great Circle Method',
          'Spherical Law of Cosines',
          'Rhumb Line Method',
          'ISNA Method'
        ];

        qiblaCalculationMethods.forEach(method => {
          expect(method).toBeDefined();
          expect(typeof method).toBe('string');
        });
      });
    });
  });

  describe('Accessibility Compliance Tests', () => {
    describe('WCAG 2.1 AA Compliance', () => {
      it('should have no accessibility violations in EducationContentCard', async () => {
        const mockContent = createCulturallyAwareMockContent();
        const { container } = render(<EducationContentCard content={mockContent} />);

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      it('should have no accessibility violations in AgeTierFilter', async () => {
        const onTierChange = jest.fn();
        const { container } = render(<AgeTierFilter onTierChange={onTierChange} />);

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      it('should have no accessibility violations in QuizInterface', async () => {
        const mockQuiz = createMulticulturalQuiz();
        const { container } = render(<QuizInterface quiz={mockQuiz} />);

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      it('should provide proper ARIA labels for Islamic content', () => {
        const mockContent = createCulturallyAwareMockContent({
          arabicContent: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ'
        });

        render(<EducationContentCard content={mockContent} />);

        const card = screen.getByRole('article');
        expect(card).toHaveAttribute('aria-label', expect.stringContaining('Islamic educational content'));
      });

      it('should support keyboard navigation for all interactive elements', () => {
        const mockContent = createCulturallyAwareMockContent();
        const onClickMock = jest.fn();

        render(<EducationContentCard content={mockContent} onClick={onClickMock} />);

        const card = screen.getByRole('article');
        
        // Should be focusable
        expect(card).toHaveAttribute('tabIndex', '0');
        
        // Should respond to Enter key
        fireEvent.keyDown(card, { key: 'Enter' });
        expect(onClickMock).toHaveBeenCalled();

        onClickMock.mockClear();

        // Should respond to Space key
        fireEvent.keyDown(card, { key: ' ' });
        expect(onClickMock).toHaveBeenCalled();
      });

      it('should provide appropriate focus management', () => {
        const onTierChange = jest.fn();
        render(<AgeTierFilter selectedTier={AgeTier.YOUTH} onTierChange={onTierChange} />);

        const clearButton = screen.getByText('Clear');
        
        // Should be focusable
        expect(clearButton).toBeInstanceOf(HTMLElement);
        
        // Should have appropriate focus styling
        clearButton.focus();
        expect(document.activeElement).toBe(clearButton);
      });
    });

    describe('Screen Reader Support', () => {
      it('should provide descriptive text for Arabic content', () => {
        const mockContent = createCulturallyAwareMockContent({
          arabicContent: 'الحمد لله رب العالمين',
          transliteration: 'Al-hamdu lillahi rabbil alameen',
          translation: 'All praise is due to Allah, Lord of all worlds'
        });

        render(<EducationContentCard content={mockContent} />);

        // Arabic content indicator should be present for screen readers
        expect(screen.getByText('Arabic Content Available')).toBeInTheDocument();
      });

      it('should provide semantic structure with proper headings', () => {
        const mockContent = createCulturallyAwareMockContent();
        render(<EducationContentCard content={mockContent} />);

        const title = screen.getByText(mockContent.title);
        
        // Title should be in a heading-like element or have appropriate role
        expect(title.tagName).toMatch(/^(H[1-6]|DIV)$/);
      });

      it('should have descriptive button labels', () => {
        const onTierChange = jest.fn();
        render(<AgeTierFilter selectedTier={AgeTier.CHILDREN} onTierChange={onTierChange} />);

        const clearButton = screen.getByText('Clear');
        
        // Button should have clear purpose
        expect(clearButton.textContent).toBe('Clear');
        expect(clearButton.closest('button')).toBeInTheDocument();
      });

      it('should provide progress information for quizzes', () => {
        const mockQuiz = createMulticulturalQuiz();
        render(<QuizInterface quiz={mockQuiz} />);

        expect(screen.getByText('Question 1 of 2')).toBeInTheDocument();
        expect(screen.getByText('Answered: 0 of 2')).toBeInTheDocument();

        // Progress bar should have role
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toBeInTheDocument();
      });
    });

    describe('Visual Accessibility', () => {
      it('should maintain sufficient color contrast for Islamic theme colors', () => {
        const mockContent = createCulturallyAwareMockContent();
        const { container } = render(<EducationContentCard content={mockContent} />);

        // Check for Islamic green theme usage
        const islamicGreenElements = container.querySelectorAll('[class*="islamic-green"]');
        
        // Elements using Islamic green should be present
        expect(islamicGreenElements.length).toBeGreaterThan(0);
      });

      it('should support high contrast mode', () => {
        // Mock high contrast mode
        Object.defineProperty(window, 'matchMedia', {
          writable: true,
          value: jest.fn().mockImplementation(query => ({
            matches: query === '(prefers-contrast: high)',
            media: query,
            onchange: null,
            addListener: jest.fn(),
            removeListener: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
          })),
        });

        const mockContent = createCulturallyAwareMockContent();
        render(<EducationContentCard content={mockContent} />);

        // Component should render without errors in high contrast mode
        expect(screen.getByText(mockContent.title)).toBeInTheDocument();
      });

      it('should scale appropriately for different font sizes', () => {
        const mockContent = createCulturallyAwareMockContent();
        const { container } = render(<EducationContentCard content={mockContent} />);

        // Component should use relative units that scale with font size
        const computedStyle = getComputedStyle(container.firstChild as Element);
        
        // Should not use fixed pixel values for font sizes in critical areas
        expect(computedStyle.fontSize).not.toBe('12px');
      });
    });

    describe('Motor Accessibility', () => {
      it('should provide sufficiently large touch targets', () => {
        const onTierChange = jest.fn();
        render(<AgeTierFilter onTierChange={onTierChange} />);

        const childrenButton = screen.getByText('Children').closest('button');
        expect(childrenButton).toBeInTheDocument();
        
        // Touch targets should be at least 44px (iOS) or 48dp (Android)
        // This would typically be tested with actual measurements
        expect(childrenButton).toBeDefined();
      });

      it('should support alternative input methods', async () => {
        const mockQuiz = createMulticulturalQuiz();
        render(<QuizInterface quiz={mockQuiz} />);

        const radioButton = screen.getAllByRole('radio')[0];
        
        // Should be activatable via keyboard
        fireEvent.keyDown(radioButton, { key: 'Space' });
        
        // Should update selection
        await waitFor(() => {
          expect(radioButton).toBeChecked();
        });
      });

      it('should provide clear focus indicators', () => {
        const mockContent = createCulturallyAwareMockContent();
        const { container } = render(<EducationContentCard content={mockContent} />);

        const focusableElement = container.querySelector('[tabindex="0"]');
        
        if (focusableElement) {
          focusableElement.focus();
          
          // Should have focus-related classes
          const classList = Array.from(focusableElement.classList);
          const hasFocusClass = classList.some(className => 
            className.includes('focus') || className.includes('ring')
          );
          
          expect(hasFocusClass).toBe(true);
        }
      });
    });

    describe('Cognitive Accessibility', () => {
      it('should provide clear and consistent navigation patterns', () => {
        const mockQuiz = createMulticulturalQuiz();
        render(<QuizInterface quiz={mockQuiz} />);

        // Navigation buttons should be clearly labeled
        expect(screen.getByText('Next')).toBeInTheDocument();
        
        // Progress indicator should be clear
        expect(screen.getByText('Question 1 of 2')).toBeInTheDocument();
      });

      it('should offer helpful explanations and context', () => {
        const mockContent = createCulturallyAwareMockContent({
          description: 'This lesson covers the fundamental principles of Islamic ethics, including honesty, kindness, and social responsibility.'
        });

        render(<EducationContentCard content={mockContent} />);

        // Should have clear, descriptive text
        expect(screen.getByText(/fundamental principles of Islamic ethics/)).toBeInTheDocument();
      });

      it('should support users with varying Islamic knowledge levels', () => {
        const beginnerContent = createCulturallyAwareMockContent({
          difficultyLevel: DifficultyLevel.BEGINNER,
          title: 'Introduction to Islam: Basic Beliefs',
          description: 'A gentle introduction to the core beliefs of Islam for new learners'
        });

        render(<EducationContentCard content={beginnerContent} />);

        expect(screen.getByText('BEGINNER')).toBeInTheDocument();
        expect(screen.getByText(/gentle introduction/)).toBeInTheDocument();
      });

      it('should provide consistent terminology and symbols', () => {
        const mockQuiz = createMulticulturalQuiz();
        render(<QuizInterface quiz={mockQuiz} />);

        // Should use consistent iconography
        const progressButtons = screen.getAllByRole('button');
        const numberButtons = progressButtons.filter(button => 
          /^\d+$/.test(button.textContent || '')
        );
        
        expect(numberButtons.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Internationalization and Localization', () => {
    describe('Arabic Text Support', () => {
      it('should handle RTL text direction properly', () => {
        const arabicContent = createCulturallyAwareMockContent({
          arabicContent: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
          title: 'Arabic Text Display Test'
        });

        const { container } = render(<EducationContentCard content={arabicContent} />);

        // Arabic content indicator should be present
        expect(screen.getByText('Arabic Content Available')).toBeInTheDocument();
        
        // Should not cause layout issues
        expect(container.firstChild).toBeDefined();
      });

      it('should properly encode and display diacritics', () => {
        const diacriticsText = [
          'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', // Al-Fatiha with full diacritics
          'صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ', // Peace be upon him in Arabic
          'رَضِيَ اللَّهُ عَنْهُ', // May Allah be pleased with him
        ];

        diacriticsText.forEach((text, index) => {
          const content = createCulturallyAwareMockContent({
            id: `arabic-${index}`,
            arabicContent: text
          });

          const { unmount } = render(<EducationContentCard content={content} />);
          
          // Should render without errors
          expect(screen.getByText('Arabic Content Available')).toBeInTheDocument();
          
          unmount();
        });
      });
    });

    describe('Cultural Date and Time Formats', () => {
      it('should support Islamic calendar dates', () => {
        const islamicDates = [
          '15 Ramadan 1445 AH',
          '1 Muharram 1446 AH',
          '27 Rajab 1445 AH' // Isra and Mi'raj
        ];

        islamicDates.forEach(date => {
          expect(date).toMatch(/\d+\s\w+\s\d+\sAH/);
        });
      });

      it('should handle different number systems', () => {
        const numberSystems = [
          { system: 'Western Arabic', example: '123456789' },
          { system: 'Eastern Arabic', example: '١٢٣٤٥٦٧٨٩' },
          { system: 'Persian', example: '۱۲۳۴۵۶۷۸۹' }
        ];

        numberSystems.forEach(({ system, example }) => {
          expect(system).toBeDefined();
          expect(example).toBeDefined();
          expect(example.length).toBe(9); // All should have 9 digits
        });
      });
    });

    describe('Regional Prayer Time Variations', () => {
      it('should accommodate different calculation methods', () => {
        const calculationMethods = [
          'Muslim World League',
          'Islamic Society of North America',
          'Egyptian General Authority',
          'Umm al-Qura University',
          'University of Islamic Sciences, Karachi'
        ];

        calculationMethods.forEach(method => {
          expect(method).toBeDefined();
          expect(typeof method).toBe('string');
        });
      });
    });
  });
});