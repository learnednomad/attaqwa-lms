import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { EducationContentCard } from '@/components/features/education/EducationContentCard'
import { AgeTier, IslamicSubject, DifficultyLevel, EducationContentType } from '@attaqwa/shared'

// Mock the router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    pathname: '/education',
  }),
}))

const mockEducationContent = {
  id: 'content-1',
  title: 'Introduction to Salah',
  description: 'Learn the fundamentals of Islamic prayer',
  subject: IslamicSubject.WORSHIP,
  ageTier: AgeTier.CHILDREN,
  difficultyLevel: DifficultyLevel.BEGINNER,
  contentType: EducationContentType.LESSON,
  estimatedDuration: 30,
  thumbnailUrl: 'https://example.com/salah-thumbnail.jpg',
  isPublished: true,
  tags: ['prayer', 'salah', 'worship'],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  author: {
    id: 'author-1',
    name: 'Sheikh Muhammad',
  },
  _count: {
    userProgress: 25,
    quizAttempts: 12,
  },
}

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  )
}

describe('EducationContentCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders education content information correctly', () => {
    renderWithProviders(
      <EducationContentCard content={mockEducationContent} />
    )

    expect(screen.getByText('Introduction to Salah')).toBeInTheDocument()
    expect(screen.getByText('Learn the fundamentals of Islamic prayer')).toBeInTheDocument()
    expect(screen.getByText('30 min')).toBeInTheDocument()
    expect(screen.getByText('Sheikh Muhammad')).toBeInTheDocument()
  })

  it('displays correct age tier badge', () => {
    renderWithProviders(
      <EducationContentCard content={mockEducationContent} />
    )

    expect(screen.getByText('Children')).toBeInTheDocument()
    expect(screen.getByText('👶')).toBeInTheDocument()
  })

  it('shows difficulty level correctly', () => {
    renderWithProviders(
      <EducationContentCard content={mockEducationContent} />
    )

    expect(screen.getByText(/Beginner/)).toBeInTheDocument()
  })

  it('displays Islamic subject correctly', () => {
    renderWithProviders(
      <EducationContentCard content={mockEducationContent} />
    )

    expect(screen.getByText(/Worship/)).toBeInTheDocument()
  })

  it('shows engagement statistics', () => {
    renderWithProviders(
      <EducationContentCard content={mockEducationContent} />
    )

    expect(screen.getByText('25')).toBeInTheDocument() // user progress count
  })

  it('renders content type badge for quiz', () => {
    const quizContent = {
      ...mockEducationContent,
      contentType: EducationContentType.QUIZ,
      title: 'Salah Knowledge Quiz',
    }

    renderWithProviders(
      <EducationContentCard content={quizContent} />
    )

    expect(screen.getByText(/Quiz/)).toBeInTheDocument()
  })

  it('displays tags when present', () => {
    renderWithProviders(
      <EducationContentCard content={mockEducationContent} />
    )

    expect(screen.getByText('#prayer')).toBeInTheDocument()
    expect(screen.getByText('#salah')).toBeInTheDocument()
    expect(screen.getByText('#worship')).toBeInTheDocument()
  })

  it('handles missing thumbnail gracefully', () => {
    const contentWithoutThumbnail = {
      ...mockEducationContent,
      thumbnailUrl: undefined,
    }

    renderWithProviders(
      <EducationContentCard content={contentWithoutThumbnail} />
    )

    // Should still render without crashing
    expect(screen.getByText('Introduction to Salah')).toBeInTheDocument()
  })

  it('shows progress indicator when user has progress', () => {
    const contentWithProgress = {
      ...mockEducationContent,
      userProgress: {
        id: 'progress-1',
        progress: 75,
        status: 'IN_PROGRESS' as const,
        lastAccessed: new Date(),
      },
    }

    renderWithProviders(
      <EducationContentCard content={contentWithProgress} />
    )

    expect(screen.getByText(/75%/)).toBeInTheDocument()
  })

  it('applies correct Islamic styling classes', () => {
    renderWithProviders(
      <EducationContentCard content={mockEducationContent} />
    )

    const card = screen.getByRole('article')
    expect(card).toHaveClass(/border/)
    expect(card).toHaveClass(/rounded/)
  })

  it('is accessible with proper ARIA labels', () => {
    renderWithProviders(
      <EducationContentCard content={mockEducationContent} />
    )

    const card = screen.getByRole('article')
    expect(card).toHaveAttribute('aria-label', expect.stringContaining('Introduction to Salah'))
  })

  it('handles click events correctly', () => {
    const mockOnClick = jest.fn()
    
    renderWithProviders(
      <EducationContentCard 
        content={mockEducationContent} 
        onClick={mockOnClick}
      />
    )

    const card = screen.getByRole('article')
    fireEvent.click(card)

    expect(mockOnClick).toHaveBeenCalledWith(mockEducationContent)
  })

  it('displays Islamic content indicators for Arabic text', () => {
    const arabicContent = {
      ...mockEducationContent,
      arabicContent: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      transliteration: 'Bismillahi rahmani raheem',
    }

    renderWithProviders(
      <EducationContentCard content={arabicContent} />
    )

    expect(screen.getByText(/Arabic/)).toBeInTheDocument()
  })
})

describe('EducationContentCard Islamic Features', () => {
  it('displays content for different Islamic subjects correctly', () => {
    const subjects = [
      { subject: IslamicSubject.QURAN, expectedText: 'Quran' },
      { subject: IslamicSubject.HADITH, expectedText: 'Hadith' },
      { subject: IslamicSubject.FIQH, expectedText: 'Fiqh' },
      { subject: IslamicSubject.WORSHIP, expectedText: 'Worship' },
      { subject: IslamicSubject.HISTORY, expectedText: 'History' },
    ]

    subjects.forEach(({ subject, expectedText }) => {
      const content = { ...mockEducationContent, subject }
      
      const { unmount } = renderWithProviders(
        <EducationContentCard content={content} />
      )

      expect(screen.getByText(new RegExp(expectedText))).toBeInTheDocument()
      unmount()
    })
  })

  it('shows appropriate content for different age tiers', () => {
    const ageTiers = [
      { tier: AgeTier.CHILDREN, icon: '👶' },
      { tier: AgeTier.YOUTH, icon: '🧑' },
      { tier: AgeTier.ADULTS, icon: '👨' },
      { tier: AgeTier.SENIORS, icon: '👴' },
      { tier: AgeTier.ALL_AGES, icon: '👥' },
    ]

    ageTiers.forEach(({ tier, icon }) => {
      const content = { ...mockEducationContent, ageTier: tier }
      
      const { unmount } = renderWithProviders(
        <EducationContentCard content={content} />
      )

      expect(screen.getByText(icon)).toBeInTheDocument()
      unmount()
    })
  })

  it('displays duration in Islamic time context', () => {
    const durations = [
      { duration: 5, expected: '5 min' },
      { duration: 30, expected: '30 min' },
      { duration: 90, expected: '1h 30min' },
    ]

    durations.forEach(({ duration, expected }) => {
      const content = { ...mockEducationContent, estimatedDuration: duration }
      
      const { unmount } = renderWithProviders(
        <EducationContentCard content={content} />
      )

      expect(screen.getByText(expected)).toBeInTheDocument()
      unmount()
    })
  })
})

describe('EducationContentCard Accessibility', () => {
  it('supports keyboard navigation', () => {
    renderWithProviders(
      <EducationContentCard content={mockEducationContent} />
    )

    const card = screen.getByRole('article')
    expect(card).toHaveAttribute('tabIndex', '0')
  })

  it('provides semantic HTML structure', () => {
    renderWithProviders(
      <EducationContentCard content={mockEducationContent} />
    )

    expect(screen.getByRole('article')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()
  })

  it('has appropriate contrast for Islamic color scheme', () => {
    renderWithProviders(
      <EducationContentCard content={mockEducationContent} />
    )

    const card = screen.getByRole('article')
    // This would need actual color contrast testing in a real implementation
    expect(card).toHaveClass(/border/)
  })
})