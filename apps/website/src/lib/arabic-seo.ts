/**
 * Arabic Text and Multilingual SEO Optimization for Islamic Content
 * Comprehensive support for Arabic text, RTL layouts, and Islamic content SEO
 */

// Arabic text processing utilities
export const ArabicTextUtils = {
  // Common Islamic phrases with translations for SEO
  ISLAMIC_PHRASES: {
    'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ': {
      transliteration: 'Bismillah ar-Rahman ar-Raheem',
      translation: 'In the name of Allah, the Most Gracious, the Most Merciful',
      keywords: ['bismillah', 'basmala', 'allah', 'rahman', 'raheem']
    },
    'السَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ': {
      transliteration: 'As-salamu alaykum wa rahmatullahi wa barakatuh',
      translation: 'Peace be upon you and Allah\'s mercy and blessings',
      keywords: ['salam', 'peace', 'greeting', 'islamic greeting']
    },
    'صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ': {
      transliteration: 'Salla Allahu alayhi wa salam',
      translation: 'Peace and blessings of Allah be upon him',
      keywords: ['pbuh', 'prophet muhammad', 'peace be upon him']
    },
    'رَضِيَ اللَّهُ عَنْهُ': {
      transliteration: 'Radi Allahu anhu',
      translation: 'May Allah be pleased with him',
      keywords: ['companion', 'sahabi', 'allah pleased']
    },
    'جَزَاكَ اللهُ خَيْرًا': {
      transliteration: 'Jazakallahu khayran',
      translation: 'May Allah reward you with goodness',
      keywords: ['thank you', 'gratitude', 'reward', 'islamic thanks']
    },
    'إِنْ شَاءَ اللهُ': {
      transliteration: 'In sha Allah',
      translation: 'If Allah wills',
      keywords: ['inshallah', 'god willing', 'allah willing']
    },
    'مَا شَاءَ اللهُ': {
      transliteration: 'Ma sha Allah',
      translation: 'What Allah has willed',
      keywords: ['mashallah', 'allah willed', 'appreciation']
    },
    'بَارَكَ اللهُ فِيكَ': {
      transliteration: 'Barakallahu feek',
      translation: 'May Allah bless you',
      keywords: ['blessing', 'barakallahu', 'allah bless']
    },
    'أَعُوذُ بِاللهِ مِنَ الشَّيْطَانِ الرَّجِيمِ': {
      transliteration: 'A\'udhu billahi min ash-shaytani\'r-rajeem',
      translation: 'I seek refuge in Allah from Satan, the accursed',
      keywords: ['refuge', 'protection', 'satan', 'evil']
    },
    'لاَ إِلَهَ إِلاَّ اللهُ مُحَمَّدٌ رَسُولُ اللهِ': {
      transliteration: 'La ilaha illa Allah, Muhammadun rasulu Allah',
      translation: 'There is no god but Allah, Muhammad is the messenger of Allah',
      keywords: ['shahada', 'testimony', 'faith', 'monotheism', 'prophet muhammad']
    }
  } as const,

  // Prayer names in Arabic
  PRAYER_NAMES_ARABIC: {
    fajr: { arabic: 'الفجر', transliteration: 'Al-Fajr', meaning: 'Dawn Prayer' },
    dhuhr: { arabic: 'الظهر', transliteration: 'Adh-Dhuhr', meaning: 'Midday Prayer' },
    asr: { arabic: 'العصر', transliteration: 'Al-Asr', meaning: 'Afternoon Prayer' },
    maghrib: { arabic: 'المغرب', transliteration: 'Al-Maghrib', meaning: 'Sunset Prayer' },
    isha: { arabic: 'العشاء', transliteration: 'Al-Isha', meaning: 'Night Prayer' },
    jumuah: { arabic: 'الجمعة', transliteration: 'Al-Jumuah', meaning: 'Friday Prayer' }
  } as const,

  // Islamic months
  HIJRI_MONTHS: {
    1: { arabic: 'مُحَرَّم', transliteration: 'Muharram', english: 'Muharram' },
    2: { arabic: 'صَفَر', transliteration: 'Safar', english: 'Safar' },
    3: { arabic: 'رَبِيع الأَوَّل', transliteration: 'Rabi al-Awwal', english: 'Rabi al-Awwal' },
    4: { arabic: 'رَبِيع الثَّانِي', transliteration: 'Rabi al-Thani', english: 'Rabi al-Thani' },
    5: { arabic: 'جُمَادَى الأُولَى', transliteration: 'Jumada al-Ula', english: 'Jumada al-Ula' },
    6: { arabic: 'جُمَادَى الآخِرَة', transliteration: 'Jumada al-Akhira', english: 'Jumada al-Akhira' },
    7: { arabic: 'رَجَب', transliteration: 'Rajab', english: 'Rajab' },
    8: { arabic: 'شَعْبَان', transliteration: 'Shaban', english: 'Shaban' },
    9: { arabic: 'رَمَضَان', transliteration: 'Ramadan', english: 'Ramadan' },
    10: { arabic: 'شَوَّال', transliteration: 'Shawwal', english: 'Shawwal' },
    11: { arabic: 'ذُو القَعْدَة', transliteration: 'Dhul-Qadah', english: 'Dhul-Qadah' },
    12: { arabic: 'ذُو الحِجَّة', transliteration: 'Dhul-Hijjah', english: 'Dhul-Hijjah' }
  } as const,

  /**
   * Add proper text direction and language attributes to Arabic text
   */
  formatArabicText(text: string, includeTransliteration?: string): string {
    const arabicSpan = `<span lang="ar" dir="rtl" class="arabic-text font-amiri">${text}</span>`;
    
    if (includeTransliteration) {
      return `${arabicSpan} <span class="transliteration text-sm text-islamic-navy-500">(${includeTransliteration})</span>`;
    }
    
    return arabicSpan;
  },

  /**
   * Extract keywords from Arabic text for SEO
   */
  extractArabicKeywords(arabicText: string): string[] {
    const phrase = this.ISLAMIC_PHRASES[arabicText as keyof typeof this.ISLAMIC_PHRASES];
    if (phrase) {
      return [
        ...phrase.keywords,
        phrase.transliteration.toLowerCase(),
        ...phrase.translation.toLowerCase().split(' ')
      ];
    }
    return [];
  },

  /**
   * Generate SEO-friendly content with Arabic text
   */
  generateMultilingualContent(arabicText: string): {
    arabic: string;
    transliteration: string;
    translation: string;
    keywords: string[];
    seoContent: string;
  } {
    const phrase = this.ISLAMIC_PHRASES[arabicText as keyof typeof this.ISLAMIC_PHRASES];
    
    if (!phrase) {
      return {
        arabic: arabicText,
        transliteration: '',
        translation: '',
        keywords: [],
        seoContent: arabicText
      };
    }

    const seoContent = `${arabicText} (${phrase.transliteration}) - ${phrase.translation}`;

    return {
      arabic: arabicText,
      transliteration: phrase.transliteration,
      translation: phrase.translation,
      keywords: phrase.keywords,
      seoContent
    };
  }
};

/**
 * Multilingual SEO optimization utilities
 */
export const MultilingualSEO = {
  // Supported languages for the mosque website
  SUPPORTED_LANGUAGES: {
    en: {
      code: 'en',
      name: 'English',
      dir: 'ltr',
      region: 'US',
      locale: 'en_US'
    },
    ar: {
      code: 'ar',
      name: 'العربية',
      dir: 'rtl',
      region: 'SA',
      locale: 'ar_SA'
    }
  } as const,

  /**
   * Generate hreflang tags for multilingual SEO
   */
  generateHreflangTags(currentPath: string, baseUrl: string) {
    return Object.entries(this.SUPPORTED_LANGUAGES).map(([code, lang]) => {
      const href = code === 'en' ? `${baseUrl}${currentPath}` : `${baseUrl}/${code}${currentPath}`;
      return {
        hreflang: code === 'en' ? 'x-default' : lang.locale.toLowerCase(),
        href
      };
    });
  },

  /**
   * Generate language-specific meta tags
   */
  generateLanguageMetaTags(language: 'en' | 'ar', content: {
    title: string;
    description: string;
    keywords: string[];
  }) {
    const lang = this.SUPPORTED_LANGUAGES[language];
    
    return {
      htmlLang: lang.code,
      dir: lang.dir,
      locale: lang.locale,
      alternates: {
        languages: {
          [lang.code]: content.title,
          ...(language === 'en' && { 'x-default': content.title })
        }
      },
      openGraph: {
        locale: lang.locale,
        ...(language === 'ar' && { locale_alternate: ['en_US'] })
      }
    };
  },

  /**
   * Generate Islamic content keywords in multiple languages
   */
  generateIslamicKeywords(category: 'prayer' | 'education' | 'events' | 'general', language: 'en' | 'ar' = 'en') {
    const keywordSets = {
      en: {
        prayer: [
          'islamic prayer', 'muslim prayer', 'salah', 'namaz', 'daily prayers',
          'fajr prayer', 'dhuhr prayer', 'asr prayer', 'maghrib prayer', 'isha prayer',
          'friday prayer', 'jumuah', 'congregation', 'mosque prayers', 'prayer times'
        ],
        education: [
          'islamic education', 'quran classes', 'hadith study', 'islamic studies',
          'religious education', 'islamic learning', 'tafsir', 'fiqh', 'seerah',
          'arabic classes', 'sunday school', 'islamic curriculum', 'islamic knowledge'
        ],
        events: [
          'islamic events', 'muslim community', 'eid celebration', 'ramadan',
          'iftar', 'community gathering', 'islamic festival', 'religious ceremony',
          'mosque events', 'halal event', 'islamic conference', 'religious program'
        ],
        general: [
          'islam', 'muslim', 'mosque', 'masjid', 'islamic center', 'muslim community',
          'islamic faith', 'religion', 'allah', 'muhammad', 'quran', 'hadith',
          'islamic culture', 'muslim worship', 'spiritual guidance'
        ]
      },
      ar: {
        prayer: [
          'صلاة', 'الصلاة', 'الفجر', 'الظهر', 'العصر', 'المغرب', 'العشاء',
          'الجمعة', 'جماعة', 'مسجد', 'أوقات الصلاة', 'أذان', 'قبلة'
        ],
        education: [
          'التعليم الإسلامي', 'دروس القرآن', 'دراسة الحديث', 'العلوم الإسلامية',
          'التربية الدينية', 'التعلم الإسلامي', 'التفسير', 'الفقه', 'السيرة',
          'دروس العربية', 'المنهج الإسلامي', 'المعرفة الإسلامية'
        ],
        events: [
          'الفعاليات الإسلامية', 'المجتمع المسلم', 'عيد', 'رمضان', 'إفطار',
          'التجمع المجتمعي', 'المهرجان الإسلامي', 'الحفل الديني', 'فعاليات المسجد'
        ],
        general: [
          'الإسلام', 'مسلم', 'مسجد', 'المركز الإسلامي', 'المجتمع المسلم',
          'الإيمان الإسلامي', 'الدين', 'الله', 'محمد', 'القرآن', 'الحديث',
          'الثقافة الإسلامية', 'العبادة', 'الإرشاد الروحي'
        ]
      }
    };

    return keywordSets[language][category] || [];
  }
};

/**
 * RTL (Right-to-Left) layout utilities for Arabic content
 */
export const RTLUtils = {
  /**
   * Generate RTL-aware CSS classes
   */
  getRTLClasses(direction: 'ltr' | 'rtl' = 'ltr') {
    if (direction === 'rtl') {
      return {
        textAlign: 'text-right',
        marginLeft: 'mr-4',
        marginRight: 'ml-4',
        paddingLeft: 'pr-4',
        paddingRight: 'pl-4',
        floatLeft: 'float-right',
        floatRight: 'float-left',
        borderLeft: 'border-r',
        borderRight: 'border-l'
      };
    }
    
    return {
      textAlign: 'text-left',
      marginLeft: 'ml-4',
      marginRight: 'mr-4',
      paddingLeft: 'pl-4',
      paddingRight: 'pr-4',
      floatLeft: 'float-left',
      floatRight: 'float-right',
      borderLeft: 'border-l',
      borderRight: 'border-r'
    };
  },

  /**
   * Generate direction-aware flexbox classes
   */
  getFlexRTLClasses(direction: 'ltr' | 'rtl' = 'ltr') {
    return {
      flexDirection: direction === 'rtl' ? 'flex-row-reverse' : 'flex-row',
      justifyStart: direction === 'rtl' ? 'justify-end' : 'justify-start',
      justifyEnd: direction === 'rtl' ? 'justify-start' : 'justify-end',
      itemsStart: direction === 'rtl' ? 'items-end' : 'items-start',
      itemsEnd: direction === 'rtl' ? 'items-start' : 'items-end'
    };
  }
};

/**
 * Islamic calendar and date utilities for SEO
 */
export const IslamicDateSEO = {
  /**
   * Generate Islamic date content for SEO
   */
  generateIslamicDateContent(gregorianDate: Date, hijriDate?: { day: number; month: number; year: number }) {
    const gregorianStr = gregorianDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    if (!hijriDate) {
      return {
        gregorian: gregorianStr,
        islamic: '',
        combined: gregorianStr,
        keywords: ['date', 'calendar', 'schedule']
      };
    }

    const monthInfo = ArabicTextUtils.HIJRI_MONTHS[hijriDate.month as keyof typeof ArabicTextUtils.HIJRI_MONTHS];
    const islamicStr = `${hijriDate.day} ${monthInfo.english} ${hijriDate.year} AH`;
    const arabicDate = `${hijriDate.day} ${monthInfo.arabic} ${hijriDate.year} هـ`;

    return {
      gregorian: gregorianStr,
      islamic: islamicStr,
      arabic: arabicDate,
      combined: `${gregorianStr} (${islamicStr})`,
      keywords: [
        'islamic calendar',
        'hijri date',
        'muslim calendar',
        monthInfo.english.toLowerCase(),
        monthInfo.transliteration.toLowerCase(),
        'islamic year',
        'hijri year'
      ]
    };
  },

  /**
   * Generate Ramadan-specific SEO content
   */
  generateRamadanSEOContent(year: number) {
    return {
      title: `Ramadan ${year} Schedule & Activities`,
      description: `Join Masjid At-Taqwa for Ramadan ${year} activities including daily Iftar, Tarawih prayers, and special programs. Complete schedule for the holy month of Ramadan.`,
      keywords: [
        `ramadan ${year}`,
        'ramadan schedule',
        'iftar times',
        'tarawih prayers',
        'ramadan activities',
        'holy month',
        'fasting',
        'suhur times',
        'ramadan calendar',
        'muslim fasting',
        'islamic month',
        'night prayers'
      ],
      arabicContent: ArabicTextUtils.formatArabicText('رَمَضَان مُبَارَك', 'Ramadan Mubarak'),
      schema: {
        '@type': 'Event',
        name: `Ramadan ${year}`,
        description: `Holy month of Ramadan ${year} with daily prayers and community activities`,
        startDate: `${year}-03-10`, // Approximate - update with actual dates
        endDate: `${year}-04-09`,   // Approximate - update with actual dates
      }
    };
  }
};

/**
 * Initialize Arabic and multilingual SEO optimization
 */
export function initializeArabicSEO() {
  if (typeof document === 'undefined') return;

  // Add Arabic font loading optimization
  const arabicFontLink = document.createElement('link');
  arabicFontLink.rel = 'preload';
  arabicFontLink.href = 'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap';
  arabicFontLink.as = 'style';
  arabicFontLink.onload = () => {
    arabicFontLink.rel = 'stylesheet';
  };
  document.head.appendChild(arabicFontLink);

  // Add RTL support CSS
  const rtlStyle = document.createElement('style');
  rtlStyle.textContent = `
    .arabic-text {
      font-family: 'Amiri', serif;
      direction: rtl;
      text-align: right;
      line-height: 1.8;
      font-size: 1.1em;
    }
    
    .transliteration {
      font-style: italic;
      direction: ltr;
      text-align: left;
    }
    
    [dir="rtl"] {
      text-align: right;
    }
    
    [dir="rtl"] .flex {
      flex-direction: row-reverse;
    }
    
    [dir="rtl"] .justify-start {
      justify-content: flex-end;
    }
    
    [dir="rtl"] .justify-end {
      justify-content: flex-start;
    }
  `;
  document.head.appendChild(rtlStyle);
}