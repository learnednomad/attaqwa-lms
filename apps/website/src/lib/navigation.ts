export type NavItem = {
  name: string;
  href?: string;
  submenu?: { name: string; href: string }[];
};

export const navigation: NavItem[] = [
  { name: 'Prayer Times', href: '/prayer-times' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  {
    name: 'Education',
    submenu: [
      { name: 'Programs', href: '/education' },
      { name: 'Seerah Curriculum', href: '/education/seerah' },
      { name: 'Browse Courses', href: '/education/browse' },
      { name: 'Student Portal', href: '/student/dashboard' },
      { name: 'Teacher Portal', href: '/teacher/dashboard' },
    ],
  },
  {
    name: 'Resources',
    submenu: [
      { name: 'Quran Study', href: '/resources/quran-study' },
      { name: 'Hadith Collections', href: '/resources/hadith-collections' },
      { name: 'Qibla Direction', href: '/resources/qibla-direction' },
      { name: 'Islamic Calendar', href: '/resources/islamic-calendar' },
      { name: 'New Muslim Guide', href: '/resources/new-muslim' },
      { name: 'All Resources', href: '/resources' },
    ],
  },
  {
    name: 'Community',
    submenu: [
      { name: 'Events', href: '/events' },
      { name: 'Announcements', href: '/announcements' },
      { name: 'Calendar', href: '/calendar' },
      { name: 'Contact', href: '/contact' },
    ],
  },
];

export const footerQuickLinks = [
  { name: 'Prayer Times', href: '/prayer-times' },
  { name: 'Events', href: '/events' },
  { name: 'Donations', href: '/donate' },
  { name: 'Contact Us', href: '/contact' },
];

export const footerResources = [
  { name: 'Quran Study', href: '/resources/quran-study' },
  { name: 'Hadith Collections', href: '/resources/hadith-collections' },
  { name: 'Qibla Direction', href: '/resources/qibla-direction' },
  { name: 'Islamic Calendar', href: '/resources/islamic-calendar' },
  { name: 'New Muslim Guide', href: '/resources/new-muslim' },
];

export const footerAbout = [
  { name: 'About Us', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Education Programs', href: '/education' },
  { name: 'Announcements', href: '/announcements' },
];
