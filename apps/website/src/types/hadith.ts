export interface HadithBook {
  id: number;
  bookName: string;
  writerName: string;
  writerDeath: string;
  aboutWriter: string | null;
  bookSlug: string;
  hadiths_count: number;
  chapters_count: number;
}

export interface HadithChapter {
  id: number;
  chapterNumber: string;
  chapterEnglish: string;
  chapterUrdu: string;
  chapterArabic: string;
  bookSlug: string;
}

export interface HadithEntry {
  id: number;
  hadithNumber: string;
  englishNarrator: string;
  hadithEnglish: string;
  hadithArabic: string;
  hadithUrdu: string;
  headingEnglish: string | null;
  headingArabic: string | null;
  status: string;
  bookSlug: string;
  chapterId: number;
  volume: string | null;
  book: {
    id: number;
    bookName: string;
    writerName: string;
    writerDeath: string;
  };
  chapter: {
    id: number;
    chapterNumber: string;
    chapterEnglish: string;
    chapterUrdu: string;
    chapterArabic: string;
  };
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
