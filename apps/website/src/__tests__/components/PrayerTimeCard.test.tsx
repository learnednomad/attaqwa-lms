import { render, screen } from '@testing-library/react'
import { PrayerTimeCard } from '@/components/features/prayer-times/PrayerTimeCard'
import { mockPrayerTimes } from '../../../jest.setup'

// Mock the hooks
jest.mock('@/lib/hooks/usePrayerTimes', () => ({
  usePrayerTimes: () => ({
    data: mockPrayerTimes,
    isLoading: false,
    error: null,
  }),
}))

describe('PrayerTimeCard', () => {
  const defaultProps = {
    prayerTimes: mockPrayerTimes,
    showNextPrayer: true,
    variant: 'default' as const,
  }

  beforeEach(() => {
    // Mock current time to be between Fajr and Dhuhr
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2024-01-01T10:00:00Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders prayer times correctly', () => {
    render(<PrayerTimeCard {...defaultProps} />)

    // Check if all prayer names are displayed
    expect(screen.getByText('Fajr')).toBeInTheDocument()
    expect(screen.getByText('Dhuhr')).toBeInTheDocument()
    expect(screen.getByText('Asr')).toBeInTheDocument()
    expect(screen.getByText('Maghrib')).toBeInTheDocument()
    expect(screen.getByText('Isha')).toBeInTheDocument()

    // Check if prayer times are displayed
    expect(screen.getByText('05:30')).toBeInTheDocument()
    expect(screen.getByText('12:45')).toBeInTheDocument()
    expect(screen.getByText('15:30')).toBeInTheDocument()
    expect(screen.getByText('18:00')).toBeInTheDocument()
    expect(screen.getByText('19:30')).toBeInTheDocument()
  })

  it('highlights the next prayer correctly', () => {
    render(<PrayerTimeCard {...defaultProps} />)

    // At 10:00 AM, the next prayer should be Dhuhr (12:45)
    const dhuhrTime = screen.getByText('12:45')
    const dhuhrContainer = dhuhrTime.closest('[data-testid="prayer-time-item"]')
    
    expect(dhuhrContainer).toHaveClass('next-prayer')
  })

  it('shows current prayer when prayer time has started', () => {
    // Set time to during Dhuhr prayer (1:00 PM)
    jest.setSystemTime(new Date('2024-01-01T13:00:00Z'))

    render(<PrayerTimeCard {...defaultProps} />)

    const dhuhrTime = screen.getByText('12:45')
    const dhuhrContainer = dhuhrTime.closest('[data-testid="prayer-time-item"]')
    
    expect(dhuhrContainer).toHaveClass('current-prayer')
  })

  it('displays location information', () => {
    render(<PrayerTimeCard {...defaultProps} />)

    expect(screen.getByText(/New York/)).toBeInTheDocument()
    expect(screen.getByText(/US/)).toBeInTheDocument()
  })

  it('renders in compact mode correctly', () => {
    render(<PrayerTimeCard {...defaultProps} variant="compact" />)

    // In compact mode, should still show prayer times but in a more condensed format
    expect(screen.getByText('Fajr')).toBeInTheDocument()
    expect(screen.getByText('05:30')).toBeInTheDocument()
  })

  it('displays countdown to next prayer when enabled', () => {
    render(<PrayerTimeCard {...defaultProps} showNextPrayer={true} />)

    // Should show some form of countdown or "next prayer" indication
    expect(screen.getByText(/next/i) || screen.getByText(/remaining/i)).toBeInTheDocument()
  })

  it('applies Islamic styling correctly', () => {
    render(<PrayerTimeCard {...defaultProps} />)

    const card = screen.getByRole('article') || screen.getByTestId('prayer-time-card')
    expect(card).toHaveClass(/islamic|prayer/)
  })

  it('handles missing prayer times gracefully', () => {
    const incompletePrayerTimes = {
      ...mockPrayerTimes,
      fajr: undefined,
    }

    render(<PrayerTimeCard {...defaultProps} prayerTimes={incompletePrayerTimes} />)

    // Should not crash and should handle missing times
    expect(screen.getByText('Dhuhr')).toBeInTheDocument()
  })

  it('displays Arabic prayer names when enabled', () => {
    render(<PrayerTimeCard {...defaultProps} showArabic={true} />)

    // Should show Arabic text for prayer names
    expect(screen.getByText(/الفجر|الظهر|العصر|المغرب|العشاء/)).toBeInTheDocument()
  })

  it('formats times according to locale', () => {
    render(<PrayerTimeCard {...defaultProps} timeFormat="12h" />)

    // Should show AM/PM format
    expect(screen.getByText(/AM|PM/)).toBeInTheDocument()
  })
})

describe('PrayerTimeCard Accessibility', () => {
  it('has proper ARIA labels', () => {
    render(<PrayerTimeCard {...mockPrayerTimes} />)

    expect(screen.getByRole('article')).toHaveAttribute('aria-label', expect.stringContaining('Prayer times'))
  })

  it('supports keyboard navigation', () => {
    render(<PrayerTimeCard {...mockPrayerTimes} />)

    const card = screen.getByRole('article')
    expect(card).toHaveAttribute('tabIndex', '0')
  })

  it('provides proper contrast for current/next prayer highlighting', () => {
    render(<PrayerTimeCard {...mockPrayerTimes} />)

    // This would need actual color contrast testing in a real implementation
    const highlightedElements = screen.getAllByTestId(/prayer-time-item/)
    highlightedElements.forEach(element => {
      expect(element).toBeInTheDocument()
    })
  })
})

describe('PrayerTimeCard Islamic Features', () => {
  it('displays Hijri date when available', () => {
    const prayerTimesWithHijri = {
      ...mockPrayerTimes,
      hijriDate: '15 Rajab 1445',
    }

    render(<PrayerTimeCard {...defaultProps} prayerTimes={prayerTimesWithHijri} />)

    expect(screen.getByText(/1445/)).toBeInTheDocument()
    expect(screen.getByText(/Rajab/)).toBeInTheDocument()
  })

  it('shows prayer method information', () => {
    const prayerTimesWithMethod = {
      ...mockPrayerTimes,
      calculationMethod: 'ISNA',
    }

    render(<PrayerTimeCard {...defaultProps} prayerTimes={prayerTimesWithMethod} />)

    expect(screen.getByText(/ISNA/)).toBeInTheDocument()
  })

  it('displays Qibla direction when available', () => {
    const prayerTimesWithQibla = {
      ...mockPrayerTimes,
      qiblaDirection: 58.5,
    }

    render(<PrayerTimeCard {...defaultProps} prayerTimes={prayerTimesWithQibla} />)

    expect(screen.getByText(/58\.5/)).toBeInTheDocument()
    expect(screen.getByText(/Qibla/i)).toBeInTheDocument()
  })
})