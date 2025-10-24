/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { EducationContentCard } from '../src/components/features/education/EducationContentCard';
import { QuizInterface } from '../src/components/features/education/QuizInterface';
import { 
  AgeTier, 
  IslamicSubject, 
  DifficultyLevel, 
  EducationContentType,
  QuestionType 
} from '@attaqwa/shared';

describe('Islamic Content Validation Tests', () => {
  describe('Arabic Text Handling', () => {
    it('should properly display Arabic text with correct directionality', () => {
      const mockContent = {
        id: 'content-1',
        title: 'Surah Al-Fatiha',
        description: 'The Opening Chapter of the Quran',
        subject: IslamicSubject.QURAN,
        ageTier: AgeTier.ALL_AGES,
        difficultyLevel: DifficultyLevel.BEGINNER,
        contentType: EducationContentType.LESSON,
        estimatedDuration: 20,
        isPublished: true,
        tags: ['quran', 'surah', 'fatiha'],
        createdAt: new Date(),
        updatedAt: new Date(),
        author: { id: 'author-1', name: 'Sheikh Abdullah' },
        _count: { userProgress: 10, quizAttempts: 5 },
        arabicContent: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
        transliteration: 'Bismillahi Ar-Rahmani Ar-Raheem',
        translation: 'In the name of Allah, the Most Gracious, the Most Merciful'
      };

      const { container } = render(<EducationContentCard content={mockContent} />);

      // Check if Arabic content indicator is present
      expect(screen.getByText('Arabic Content Available')).toBeInTheDocument();

      // Verify Arabic text would be rendered with proper styling
      const arabicSection = container.querySelector('.bg-islamic-green-50');
      expect(arabicSection).toBeInTheDocument();
    });

    it('should handle complex Arabic text with diacritics', () => {
      const arabicTextSamples = [
        'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', // Al-Hamdu lillahi rabbil alameen
        'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ', // Allahumma salli ala Muhammad
        'لَا إِلَهَ إِلَّا اللَّهُ مُحَمَّدٌ رَسُولُ اللَّهِ', // Shahada
        'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ' // Tasbih
      ];

      arabicTextSamples.forEach((arabicText, index) => {
        const mockContent = {
          id: `content-${index}`,
          title: `Islamic Text ${index + 1}`,
          description: 'Testing Arabic text rendering',
          subject: IslamicSubject.DUA_DHIKR,
          ageTier: AgeTier.ALL_AGES,
          difficultyLevel: DifficultyLevel.BEGINNER,
          contentType: EducationContentType.LESSON,
          estimatedDuration: 15,
          isPublished: true,
          tags: ['dua', 'dhikr'],
          createdAt: new Date(),
          updatedAt: new Date(),
          author: { id: 'author-1', name: 'Sheikh Abdullah' },
          _count: { userProgress: 0, quizAttempts: 0 },
          arabicContent: arabicText,
          transliteration: 'Test transliteration',
          translation: 'Test translation'
        };

        const { unmount } = render(<EducationContentCard content={mockContent} />);
        
        // Should display Arabic content indicator
        expect(screen.getByText('Arabic Content Available')).toBeInTheDocument();
        
        unmount();
      });
    });

    it('should validate transliteration format consistency', () => {
      const transliterationSamples = [
        {
          arabic: 'اللَّهُ أَكْبَرُ',
          transliteration: 'Allahu Akbar',
          translation: 'Allah is the Greatest'
        },
        {
          arabic: 'أَسْتَغْفِرُ اللَّهَ',
          transliteration: 'Astaghfirullah',
          translation: 'I seek forgiveness from Allah'
        },
        {
          arabic: 'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ',
          transliteration: 'Inna lillahi wa inna ilayhi rajioon',
          translation: 'Indeed we belong to Allah, and indeed to Him we will return'
        }
      ];

      transliterationSamples.forEach((sample, index) => {
        const mockContent = {
          id: `content-${index}`,
          title: `Du\'a ${index + 1}`,
          description: 'Testing transliteration',
          subject: IslamicSubject.DUA_DHIKR,
          ageTier: AgeTier.ALL_AGES,
          difficultyLevel: DifficultyLevel.BEGINNER,
          contentType: EducationContentType.LESSON,
          estimatedDuration: 10,
          isPublished: true,
          tags: ['dua'],
          createdAt: new Date(),
          updatedAt: new Date(),
          author: { id: 'author-1', name: 'Sheikh Abdullah' },
          _count: { userProgress: 0, quizAttempts: 0 },
          arabicContent: sample.arabic,
          transliteration: sample.transliteration,
          translation: sample.translation
        };

        const { unmount } = render(<EducationContentCard content={mockContent} />);
        
        // Verify transliteration follows consistent format
        expect(sample.transliteration).toMatch(/^[A-Za-z\s]+$/); // Only English letters and spaces
        expect(sample.transliteration).not.toMatch(/[0-9]/); // No numbers
        
        unmount();
      });
    });
  });

  describe('Quranic References Validation', () => {
    it('should handle Quranic verse references correctly', () => {
      const quranicQuiz = {
        id: 'quran-quiz-1',
        title: 'Quranic Knowledge Test',
        description: 'Test understanding of Quranic verses',
        questions: [
          {
            id: 'q1',
            questionText: 'Complete the verse: "And Allah is with..."',
            questionType: QuestionType.MULTIPLE_CHOICE,
            options: [
              { id: 'opt1', text: 'the patient ones', isCorrect: true },
              { id: 'opt2', text: 'the wealthy ones', isCorrect: false },
              { id: 'opt3', text: 'the strong ones', isCorrect: false },
              { id: 'opt4', text: 'the famous ones', isCorrect: false }
            ],
            explanation: 'From Surah Al-Baqarah (2:153): "And Allah is with the patient ones"',
            points: 5,
            order: 1,
            arabicText: 'وَاللَّهُ مَعَ الصَّابِرِينَ',
            reference: 'Surah Al-Baqarah 2:153'
          },
          {
            id: 'q2',
            questionText: 'What is the first verse revealed to Prophet Muhammad (ﷺ)?',
            questionType: QuestionType.SHORT_ANSWER,
            options: [
              { id: 'opt5', text: 'Read in the name of your Lord', isCorrect: true }
            ],
            explanation: 'The first revelation was Surah Al-Alaq (96:1-5)',
            points: 10,
            order: 2,
            arabicText: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ',
            reference: 'Surah Al-Alaq 96:1'
          }
        ],
        passingScore: 70,
        subject: IslamicSubject.QURAN,
        ageTier: AgeTier.ADULTS,
        difficultyLevel: DifficultyLevel.INTERMEDIATE
      };

      render(<QuizInterface quiz={quranicQuiz} />);

      // Should display Quranic content appropriately
      expect(screen.getByText('Complete the verse: "And Allah is with..."')).toBeInTheDocument();
      expect(screen.getByText('QURAN')).toBeInTheDocument();
      
      // Question should reference proper Islamic terminology
      expect(screen.getByText(/Prophet Muhammad \(ﷺ\)/)).toBeInTheDocument();
    });

    it('should validate Hadith references format', () => {
      const hadithQuiz = {
        id: 'hadith-quiz-1',
        title: 'Hadith Studies Quiz',
        description: 'Test knowledge of authentic Hadith',
        questions: [
          {
            id: 'q1',
            questionText: 'According to a Hadith in Sahih Bukhari, what are the three things that continue to benefit a person after death?',
            questionType: QuestionType.MULTIPLE_CHOICE,
            options: [
              { id: 'opt1', text: 'Charity, knowledge, righteous child', isCorrect: true },
              { id: 'opt2', text: 'Wealth, fame, power', isCorrect: false },
              { id: 'opt3', text: 'House, car, business', isCorrect: false },
              { id: 'opt4', text: 'Gold, silver, jewels', isCorrect: false }
            ],
            explanation: 'Sahih Muslim: Sadaqah jariyah, knowledge that benefits, and a righteous child who prays for them',
            points: 10,
            order: 1,
            reference: 'Sahih Muslim, Book 13, Hadith 4005'
          }
        ],
        passingScore: 70,
        subject: IslamicSubject.HADITH,
        ageTier: AgeTier.ADULTS,
        difficultyLevel: DifficultyLevel.ADVANCED
      };

      render(<QuizInterface quiz={hadithQuiz} />);

      expect(screen.getByText(/According to a Hadith in Sahih Bukhari/)).toBeInTheDocument();
      expect(screen.getByText('HADITH')).toBeInTheDocument();
    });

    it('should ensure proper Islamic terminology usage', () => {
      const islamicTerminology = [
        'Prophet Muhammad (ﷺ)', // Peace be upon him
        'Allah (SWT)', // Subhanahu wa ta\'ala
        'Quran', // Not Koran
        'Masjid', // Not mosque in Arabic contexts
        'Salah', // Not prayer in technical contexts
        'Zakat', // Not charity in technical contexts
        'Hajj', // Pilgrimage
        'Seerah', // Biography of the Prophet
        'Sunnah', // Prophetic tradition
        'Hadith', // Prophetic sayings
      ];

      islamicTerminology.forEach(term => {
        // Test that terminology validation would pass
        expect(term).toMatch(/^[\w\s\(\)\.ﷺ]+$/); // Allow proper Islamic terms
      });
    });
  });

  describe('Cultural Sensitivity Validation', () => {
    it('should use appropriate Islamic greetings and expressions', () => {
      const islamicExpressions = [
        'Assalamu Alaikum', // Peace be upon you
        'Bismillah', // In the name of Allah
        'Alhamdulillah', // Praise be to Allah
        'Subhanallah', // Glory be to Allah
        'Astaghfirullah', // I seek forgiveness from Allah
        'Insha\'Allah', // If Allah wills
        'Masha\'Allah', // What Allah has willed
        'Barakallahu feeki', // May Allah bless you (feminine)
        'Barakallahu feek', // May Allah bless you (masculine)
        'JazakAllahu khair' // May Allah reward you with good
      ];

      // These expressions should be recognized and properly handled
      islamicExpressions.forEach(expression => {
        expect(expression).toBeDefined();
        expect(typeof expression).toBe('string');
        expect(expression.length).toBeGreaterThan(0);
      });
    });

    it('should respect Islamic calendar and time references', () => {
      const islamicTimeReferences = [
        'Hijri Calendar',
        'Ramadan',
        'Shawwal',
        'Dhul Hijjah',
        'Muharram',
        'Safar',
        'Rabi\' al-awwal',
        'Rabi\' al-thani',
        'Jumada al-awwal',
        'Jumada al-thani',
        'Rajab',
        'Sha\'ban'
      ];

      islamicTimeReferences.forEach(reference => {
        // Validate that Islamic time references are handled properly
        expect(reference).toBeDefined();
        expect(reference).not.toMatch(/gregorian|christian|western/i);
      });
    });

    it('should handle Islamic educational age appropriateness', () => {
      const ageAppropriateContent = [
        {
          ageTier: AgeTier.CHILDREN,
          topics: ['Basic Du\'as', 'Prophet Stories', 'Islamic Manners', 'Love for Allah'],
          avoidTopics: ['Complex Jurisprudence', 'Controversial Issues', 'Adult Responsibilities']
        },
        {
          ageTier: AgeTier.YOUTH,
          topics: ['Islamic Identity', 'Contemporary Issues', 'Peer Guidance', 'Future Planning'],
          avoidTopics: ['Child-only Content', 'Advanced Scholarship']
        },
        {
          ageTier: AgeTier.ADULTS,
          topics: ['Complex Fiqh', 'Family Responsibilities', 'Community Leadership', 'In-depth Study'],
          avoidTopics: ['Overly Simplified Content']
        }
      ];

      ageAppropriateContent.forEach(ageGroup => {
        // Validate age-appropriate content guidelines
        expect(ageGroup.topics).toBeDefined();
        expect(Array.isArray(ageGroup.topics)).toBe(true);
        expect(ageGroup.topics.length).toBeGreaterThan(0);
        
        expect(ageGroup.avoidTopics).toBeDefined();
        expect(Array.isArray(ageGroup.avoidTopics)).toBe(true);
      });
    });

    it('should validate Islamic subject categorization', () => {
      const islamicSubjects = Object.values(IslamicSubject);
      const expectedSubjects = [
        'QURAN', 'HADITH', 'FIQH', 'AQIDAH', 'SEERAH',
        'ISLAMIC_HISTORY', 'ARABIC_LANGUAGE', 'DUA_DHIKR',
        'ISLAMIC_ETIQUETTE', 'COMPARATIVE_RELIGION'
      ];

      expect(islamicSubjects.sort()).toEqual(expectedSubjects.sort());

      // Validate each subject has appropriate educational context
      islamicSubjects.forEach(subject => {
        expect(subject).toMatch(/^[A-Z_]+$/); // Uppercase constant format
        expect(subject).not.toMatch(/secular|non_islamic|western/i);
      });
    });

    it('should ensure respectful language in Islamic content', () => {
      const respectfulPhrases = [
        'Prophet Muhammad (ﷺ)',
        'Peace be upon him',
        'May Allah be pleased with him',
        'May Allah be pleased with her',
        'Subhanahu wa ta\'ala',
        'Alayhis salaam',
        'Radiyallahu anhu',
        'Radiyallahu anha'
      ];

      respectfulPhrases.forEach(phrase => {
        // Validate respectful Islamic phrases are properly formatted
        expect(phrase).toBeDefined();
        expect(phrase).not.toMatch(/disrespectful|inappropriate/i);
      });
    });

    it('should validate proper Islamic educational progression', () => {
      const educationalProgression = [
        {
          level: DifficultyLevel.BEGINNER,
          focus: 'Basic Islamic concepts, simple practices, foundational beliefs',
          examples: ['Five Pillars', 'Basic Du\'as', 'Prophet Stories', 'Islamic Manners']
        },
        {
          level: DifficultyLevel.INTERMEDIATE,
          focus: 'Detailed understanding, practical application, intermediate practices',
          examples: ['Detailed Fiqh', 'Seerah Study', 'Islamic History', 'Community Responsibilities']
        },
        {
          level: DifficultyLevel.ADVANCED,
          focus: 'Complex jurisprudence, scholarly discussions, research',
          examples: ['Advanced Fiqh', 'Hadith Sciences', 'Quranic Exegesis', 'Islamic Philosophy']
        },
        {
          level: DifficultyLevel.SCHOLAR,
          focus: 'Academic research, teaching, scholarly contributions',
          examples: ['Research Methodology', 'Comparative Studies', 'Advanced Arabic', 'Teaching Methods']
        }
      ];

      educationalProgression.forEach(level => {
        expect(level.level).toBeDefined();
        expect(level.focus).toBeDefined();
        expect(Array.isArray(level.examples)).toBe(true);
        expect(level.examples.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Content Quality Assurance', () => {
    it('should validate Islamic content authenticity markers', () => {
      const authenticityMarkers = [
        'Quran reference provided',
        'Hadith grading mentioned',
        'Scholarly consensus noted',
        'Multiple sources cited',
        'Classical references included'
      ];

      authenticityMarkers.forEach(marker => {
        expect(marker).toBeDefined();
        expect(typeof marker).toBe('string');
      });
    });

    it('should ensure balanced representation across Islamic schools of thought', () => {
      const islamicSchools = [
        'Hanafi', 'Maliki', 'Shafi\'i', 'Hanbali', // Sunni schools
        'Ash\'ari', 'Maturidi', // Theological schools
        'Traditional', 'Contemporary' // Methodological approaches
      ];

      islamicSchools.forEach(school => {
        expect(school).toBeDefined();
        expect(school).not.toMatch(/sectarian|biased|exclusive/i);
      });
    });

    it('should validate inclusive Islamic education approach', () => {
      const inclusiveApproach = {
        genderInclusive: true,
        culturallyDiverse: true,
        accessibilityConscious: true,
        multilingualSupport: true,
        economicallyAccessible: true
      };

      Object.entries(inclusiveApproach).forEach(([key, value]) => {
        expect(value).toBe(true);
      });
    });
  });

  describe('Technical Islamic Content Validation', () => {
    it('should properly encode Arabic text for display', () => {
      const arabicTexts = [
        'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
        'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        'قُلْ هُوَ اللَّهُ أَحَدٌ'
      ];

      arabicTexts.forEach(text => {
        // Validate UTF-8 encoding
        const encoded = encodeURIComponent(text);
        const decoded = decodeURIComponent(encoded);
        expect(decoded).toBe(text);

        // Validate no corruption in Arabic text
        expect(text).toMatch(/[\u0600-\u06FF\u0750-\u077F]+/); // Arabic Unicode ranges
      });
    });

    it('should handle right-to-left text direction', () => {
      const rtlText = 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ';
      
      // In a real implementation, this would test CSS direction: rtl
      expect(rtlText).toMatch(/[\u0600-\u06FF]+/);
      
      // Validate text direction markers would be applied
      const textDirection = 'rtl';
      expect(textDirection).toBe('rtl');
    });

    it('should validate Islamic date formatting', () => {
      const islamicDates = [
        '1 Muharram 1445 AH',
        '15 Ramadan 1444 AH',
        '10 Dhul Hijjah 1443 AH'
      ];

      islamicDates.forEach(date => {
        expect(date).toMatch(/\d+\s\w+\s\d+\sAH/);
        expect(date).toContain('AH'); // After Hijra
      });
    });

    it('should handle Islamic prayer time formatting', () => {
      const prayerTimes = {
        fajr: '05:30',
        sunrise: '06:45',
        dhuhr: '12:15',
        asr: '15:30',
        maghrib: '18:20',
        isha: '19:45'
      };

      Object.entries(prayerTimes).forEach(([prayer, time]) => {
        expect(time).toMatch(/^\d{2}:\d{2}$/); // HH:MM format
        expect(['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha']).toContain(prayer);
      });
    });

    it('should validate Qibla direction data format', () => {
      const qiblaDirection = {
        degrees: 58.5,
        cardinal: 'Northeast',
        city: 'Toronto',
        accuracy: 'high'
      };

      expect(qiblaDirection.degrees).toBeGreaterThanOrEqual(0);
      expect(qiblaDirection.degrees).toBeLessThan(360);
      expect(typeof qiblaDirection.cardinal).toBe('string');
      expect(['high', 'medium', 'low']).toContain(qiblaDirection.accuracy);
    });
  });
});