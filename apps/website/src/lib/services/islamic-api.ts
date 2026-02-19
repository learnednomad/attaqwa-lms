// Islamic API Services for authentic content
// Using reliable sources: Sunnah.com, Al-Quran Cloud, and other verified APIs

interface HadithData {
  collection: string;
  bookNumber: string;
  hadithNumber: string;
  hadith: {
    arab: string;
    english: string;
    narrator: string;
  };
  grade: string;
  reference: string;
}

interface AyahData {
  number: number;
  text: string;
  translation: string;
  tafsir: string;
  surah: {
    number: number;
    name: string;
    englishName: string;
    revelationType: string;
  };
  juz: number;
  page: number;
  audio?: string;
}

interface QiblahData {
  latitude: number;
  longitude: number;
  qibla: {
    direction: number;
    compass: number;
  };
}

// Hadith Collections from Sunnah.com API
export async function fetchAuthenticHadith(
  collection: string = 'bukhari',
  bookNumber?: number
): Promise<HadithData[]> {
  try {
    // Using Sunnah.com API structure
    const apiUrl = `https://api.sunnah.com/v1/collections/${collection}/books/${bookNumber || 1}/hadiths`;
    
    const apiKey = process.env.NEXT_PUBLIC_SUNNAH_API_KEY;
    if (!apiKey) {
      throw new Error('NEXT_PUBLIC_SUNNAH_API_KEY is not configured');
    }

    const response = await fetch(apiUrl, {
      headers: {
        'x-api-key': apiKey
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch hadith');
    }

    const data = await response.json();
    
    // Filter only Sahih (authentic) hadiths
    return data.hadiths.filter((h: any) => 
      h.grade && (h.grade.includes('Sahih') || h.grade.includes('Authentic'))
    );
  } catch (error) {
    console.error('Error fetching hadith:', error);
    // Return mock data for development
    return getMockHadithData();
  }
}

// Quran API for Ayah of the Day with Tafsir
export async function fetchAyahOfTheDay(): Promise<AyahData> {
  try {
    // Generate a random ayah for the day based on date
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const ayahNumber = (dayOfYear % 6236) + 1; // Total ayahs in Quran

    const arabicResponse = await fetch(`https://api.alquran.cloud/v1/ayah/${ayahNumber}`);
    const translationResponse = await fetch(`https://api.alquran.cloud/v1/ayah/${ayahNumber}/en.sahih`);
    const tafsirResponse = await fetch(`https://api.alquran.cloud/v1/ayah/${ayahNumber}/en.tafsir.maududi`);

    const arabic = await arabicResponse.json();
    const translation = await translationResponse.json();
    const tafsir = await tafsirResponse.json();

    return {
      number: arabic.data.numberInSurah,
      text: arabic.data.text,
      translation: translation.data.text,
      tafsir: tafsir.data.text,
      surah: arabic.data.surah,
      juz: arabic.data.juz,
      page: arabic.data.page,
      audio: arabic.data.audio
    };
  } catch (error) {
    console.error('Error fetching ayah:', error);
    return getMockAyahData();
  }
}

// Fetch Surah with grouped ayahs by context
export async function fetchSurahWithContext(surahNumber: number): Promise<any> {
  try {
    const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
    const translationResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.sahih`);
    
    const arabic = await response.json();
    const translation = await translationResponse.json();

    // Group ayahs by context (example grouping for Al-Baqarah)
    const contextGroups = getContextualGrouping(surahNumber, arabic.data.ayahs, translation.data.ayahs);
    
    return {
      ...arabic.data,
      translation: translation.data,
      contextGroups
    };
  } catch (error) {
    console.error('Error fetching surah:', error);
    return null;
  }
}

// Qiblah Direction Calculator
export async function calculateQiblaDirection(latitude: number, longitude: number): Promise<QiblahData> {
  // Kaaba coordinates
  const kaabaLat = 21.4225;
  const kaabaLng = 39.8262;

  // Calculate Qibla direction
  const phiK = kaabaLat * Math.PI / 180.0;
  const lambdaK = kaabaLng * Math.PI / 180.0;
  const phi = latitude * Math.PI / 180.0;
  const lambda = longitude * Math.PI / 180.0;
  const psi = 180.0 / Math.PI * Math.atan2(
    Math.sin(lambdaK - lambda),
    Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda)
  );
  
  const direction = Math.round(psi);
  const compass = direction < 0 ? direction + 360 : direction;

  return {
    latitude,
    longitude,
    qibla: {
      direction,
      compass
    }
  };
}

// Islamic Calendar Data
export async function fetchIslamicCalendar(date?: Date): Promise<any> {
  try {
    const targetDate = date || new Date();
    const dateString = targetDate.toISOString().split('T')[0];
    
    const response = await fetch(`https://api.aladhan.com/v1/gToH?date=${dateString}`);
    const data = await response.json();
    
    return data.data.hijri;
  } catch (error) {
    console.error('Error fetching Islamic calendar:', error);
    return getMockCalendarData();
  }
}

// Helper function to group ayahs by context
function getContextualGrouping(surahNumber: number, arabicAyahs: any[], translationAyahs: any[]): any[] {
  // Example grouping for Al-Baqarah (Surah 2)
  if (surahNumber === 2) {
    return [
      {
        title: "Opening - Believers, Disbelievers, and Hypocrites",
        ayahs: [1, 20],
        theme: "Classification of mankind and their characteristics"
      },
      {
        title: "Story of Adam and the Beginning",
        ayahs: [21, 39],
        theme: "Creation story and divine guidance"
      },
      {
        title: "Children of Israel - Lessons from History",
        ayahs: [40, 103],
        theme: "Historical lessons and warnings"
      },
      {
        title: "Abraham and the Building of Kaaba",
        ayahs: [104, 141],
        theme: "Foundation of monotheism and the sacred mosque"
      },
      {
        title: "Change of Qiblah and Prayer",
        ayahs: [142, 152],
        theme: "Unity of the Muslim community"
      },
      {
        title: "Laws and Commandments - Part 1",
        ayahs: [153, 177],
        theme: "Patience, legal retribution, and wills"
      },
      {
        title: "Fasting and Ramadan",
        ayahs: [178, 188],
        theme: "Spiritual purification through fasting"
      },
      // Add more contextual groups as needed
    ];
  }
  
  // Default grouping for other surahs
  return [{
    title: "Complete Surah",
    ayahs: [1, arabicAyahs.length],
    theme: "Full chapter"
  }];
}

// Mock data functions for development
function getMockHadithData(): HadithData[] {
  return [
    {
      collection: 'bukhari',
      bookNumber: '1',
      hadithNumber: '1',
      hadith: {
        arab: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
        english: 'Actions are judged by intentions, and every person will get what they intended.',
        narrator: 'Umar ibn al-Khattab'
      },
      grade: 'Sahih (Authentic)',
      reference: 'Sahih al-Bukhari 1'
    },
    {
      collection: 'muslim',
      bookNumber: '1',
      hadithNumber: '1',
      hadith: {
        arab: 'الدِّينُ النَّصِيحَةُ',
        english: 'The religion is sincerity/good advice.',
        narrator: 'Tamim al-Dari'
      },
      grade: 'Sahih (Authentic)',
      reference: 'Sahih Muslim 95'
    }
  ];
}

function getMockAyahData(): AyahData {
  return {
    number: 255,
    text: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
    translation: 'Allah! There is no deity except Him, the Ever-Living, the Sustainer of existence.',
    tafsir: 'This is Ayat al-Kursi, one of the most powerful verses in the Quran, describing Allah\'s absolute sovereignty and attributes.',
    surah: {
      number: 2,
      name: 'Al-Baqarah',
      englishName: 'The Cow',
      revelationType: 'Medinan'
    },
    juz: 3,
    page: 42,
    audio: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/255.mp3'
  };
}

function getMockCalendarData(): any {
  const today = new Date();
  return {
    date: '15-05-1445',
    format: 'DD-MM-YYYY',
    day: '15',
    month: {
      number: 5,
      en: 'Jumada al-awwal',
      ar: 'جُمَادَى الأُولَى'
    },
    year: '1445',
    designation: {
      abbreviated: 'AH',
      expanded: 'Anno Hegirae'
    },
    holidays: ['Isra and Miraj']
  };
}