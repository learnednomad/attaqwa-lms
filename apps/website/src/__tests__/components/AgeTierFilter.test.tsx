import { render, screen, fireEvent } from '@testing-library/react'
import { AgeTierFilter, AgeTierBadge, useAgeTierFilter } from '@/components/features/education/AgeTierFilter'
import { AgeTier } from '@attaqwa/shared'
import { renderHook, act } from '@testing-library/react'

describe('AgeTierFilter', () => {
  const mockOnTierChange = jest.fn()
  
  const defaultProps = {
    onTierChange: mockOnTierChange,
  }

  beforeEach(() => {
    mockOnTierChange.mockClear()
  })

  it('renders all age tier options', () => {
    render(<AgeTierFilter {...defaultProps} />)

    expect(screen.getByText('Children')).toBeInTheDocument()
    expect(screen.getByText('Youth')).toBeInTheDocument()
    expect(screen.getByText('Adults')).toBeInTheDocument()
    expect(screen.getByText('Seniors')).toBeInTheDocument()
    expect(screen.getByText('All Ages')).toBeInTheDocument()
  })

  it('displays correct age descriptions', () => {
    render(<AgeTierFilter {...defaultProps} />)

    expect(screen.getByText('Ages 5-12')).toBeInTheDocument()
    expect(screen.getByText('Ages 13-17')).toBeInTheDocument()
    expect(screen.getByText('Ages 18+')).toBeInTheDocument()
    expect(screen.getByText('Ages 60+')).toBeInTheDocument()
    expect(screen.getByText('Suitable for everyone')).toBeInTheDocument()
  })

  it('shows Islamic educational guidance for each age group', () => {
    render(<AgeTierFilter {...defaultProps} />)

    expect(screen.getByText('Basic Islamic stories, prayers, and moral values')).toBeInTheDocument()
    expect(screen.getByText('Islamic identity, contemporary issues, and guidance')).toBeInTheDocument()
    expect(screen.getByText('In-depth Islamic knowledge and practical application')).toBeInTheDocument()
    expect(screen.getByText('Wisdom, reflection, and life experience sharing')).toBeInTheDocument()
    expect(screen.getByText('Universal Islamic teachings for the whole family')).toBeInTheDocument()
  })

  it('calls onTierChange when tier is selected', () => {
    render(<AgeTierFilter {...defaultProps} />)

    const childrenButton = screen.getByRole('button', { name: /Children/ })
    fireEvent.click(childrenButton)

    expect(mockOnTierChange).toHaveBeenCalledWith(AgeTier.CHILDREN)
  })

  it('shows selected tier with visual indication', () => {
    render(<AgeTierFilter {...defaultProps} selectedTier={AgeTier.YOUTH} />)

    const youthButton = screen.getByRole('button', { name: /Youth/ })
    expect(youthButton).toHaveClass('border-islamic-green-500')
    expect(youthButton).toHaveClass('bg-islamic-green-50')
  })

  it('displays clear button when tier is selected', () => {
    render(<AgeTierFilter {...defaultProps} selectedTier={AgeTier.ADULTS} />)

    const clearButton = screen.getByRole('button', { name: /Clear/ })
    expect(clearButton).toBeInTheDocument()

    fireEvent.click(clearButton)
    expect(mockOnTierChange).toHaveBeenCalledWith(undefined)
  })

  it('shows content counts when stats are enabled', () => {
    const contentCounts = {
      [AgeTier.CHILDREN]: 15,
      [AgeTier.YOUTH]: 12,
      [AgeTier.ADULTS]: 25,
      [AgeTier.SENIORS]: 8,
      [AgeTier.ALL_AGES]: 20,
    }

    render(
      <AgeTierFilter 
        {...defaultProps} 
        showStats={true} 
        contentCounts={contentCounts} 
      />
    )

    expect(screen.getByText('15')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('25')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('20')).toBeInTheDocument()
  })

  it('displays Islamic education guidelines', () => {
    render(<AgeTierFilter {...defaultProps} />)

    expect(screen.getByText('🌟 Age-Appropriate Islamic Education')).toBeInTheDocument()
    expect(screen.getByText(/Our content is carefully curated to match Islamic educational principles/)).toBeInTheDocument()
  })

  it('shows detailed learning focus when tier is selected', () => {
    render(<AgeTierFilter {...defaultProps} selectedTier={AgeTier.CHILDREN} />)

    expect(screen.getByText('Learning Focus for Children')).toBeInTheDocument()
    expect(screen.getByText(/Focus on foundational Islamic concepts through stories/)).toBeInTheDocument()
    expect(screen.getByText(/Prophet Muhammad \(ﷺ\)/)).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<AgeTierFilter {...defaultProps} />)

    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button).toHaveAttribute('tabIndex')
    })
  })

  it('supports keyboard navigation', () => {
    render(<AgeTierFilter {...defaultProps} />)

    const childrenButton = screen.getByRole('button', { name: /Children/ })
    expect(childrenButton).toHaveClass('focus:outline-none')
    expect(childrenButton).toHaveClass('focus:ring-2')
    expect(childrenButton).toHaveClass('focus:ring-islamic-green-500')
  })
})

describe('AgeTierBadge', () => {
  it('renders tier badge with correct icon and label', () => {
    render(<AgeTierBadge tier={AgeTier.CHILDREN} />)

    expect(screen.getByText('👶')).toBeInTheDocument()
    expect(screen.getByText('Children')).toBeInTheDocument()
  })

  it('shows description when enabled', () => {
    render(<AgeTierBadge tier={AgeTier.YOUTH} showDescription={true} />)

    expect(screen.getByText('🧑')).toBeInTheDocument()
    expect(screen.getByText('Youth')).toBeInTheDocument()
    expect(screen.getByText('(Ages 13-17)')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const customClass = 'custom-badge-class'
    render(<AgeTierBadge tier={AgeTier.ADULTS} className={customClass} />)

    const badge = screen.getByText('👨').closest('.badge')
    expect(badge).toHaveClass(customClass)
  })

  it('renders all age tiers correctly', () => {
    const tiers = [
      { tier: AgeTier.CHILDREN, icon: '👶', label: 'Children' },
      { tier: AgeTier.YOUTH, icon: '🧑', label: 'Youth' },
      { tier: AgeTier.ADULTS, icon: '👨', label: 'Adults' },
      { tier: AgeTier.SENIORS, icon: '👴', label: 'Seniors' },
      { tier: AgeTier.ALL_AGES, icon: '👥', label: 'All Ages' },
    ]

    tiers.forEach(({ tier, icon, label }) => {
      const { unmount } = render(<AgeTierBadge tier={tier} />)
      
      expect(screen.getByText(icon)).toBeInTheDocument()
      expect(screen.getByText(label)).toBeInTheDocument()
      
      unmount()
    })
  })
})

describe('useAgeTierFilter hook', () => {
  it('initializes with no selected tier', () => {
    const { result } = renderHook(() => useAgeTierFilter())

    expect(result.current.selectedTier).toBeUndefined()
  })

  it('allows setting selected tier', () => {
    const { result } = renderHook(() => useAgeTierFilter())

    act(() => {
      result.current.setSelectedTier(AgeTier.YOUTH)
    })

    expect(result.current.selectedTier).toBe(AgeTier.YOUTH)
  })

  it('clears filter correctly', () => {
    const { result } = renderHook(() => useAgeTierFilter())

    act(() => {
      result.current.setSelectedTier(AgeTier.ADULTS)
    })

    expect(result.current.selectedTier).toBe(AgeTier.ADULTS)

    act(() => {
      result.current.clearFilter()
    })

    expect(result.current.selectedTier).toBeUndefined()
  })

  it('filters content by age tier', () => {
    const { result } = renderHook(() => useAgeTierFilter())
    
    const mockContent = [
      { id: '1', ageTier: AgeTier.CHILDREN, title: 'Kids Content' },
      { id: '2', ageTier: AgeTier.ADULTS, title: 'Adult Content' },
      { id: '3', ageTier: AgeTier.ALL_AGES, title: 'Family Content' },
    ]

    act(() => {
      result.current.setSelectedTier(AgeTier.CHILDREN)
    })

    const filtered = result.current.filterContentByAge(mockContent)
    
    expect(filtered).toHaveLength(2) // Children + All Ages
    expect(filtered.map(c => c.id)).toEqual(['1', '3'])
  })

  it('returns all content when no tier is selected', () => {
    const { result } = renderHook(() => useAgeTierFilter())
    
    const mockContent = [
      { id: '1', ageTier: AgeTier.CHILDREN },
      { id: '2', ageTier: AgeTier.ADULTS },
      { id: '3', ageTier: AgeTier.YOUTH },
    ]

    const filtered = result.current.filterContentByAge(mockContent)
    
    expect(filtered).toHaveLength(3)
    expect(filtered).toEqual(mockContent)
  })

  it('recommends appropriate tier based on user age', () => {
    const { result } = renderHook(() => useAgeTierFilter())

    expect(result.current.getRecommendedTier(8)).toBe(AgeTier.CHILDREN)
    expect(result.current.getRecommendedTier(15)).toBe(AgeTier.YOUTH)
    expect(result.current.getRecommendedTier(25)).toBe(AgeTier.ADULTS)
    expect(result.current.getRecommendedTier(65)).toBe(AgeTier.SENIORS)
    expect(result.current.getRecommendedTier()).toBe(AgeTier.ALL_AGES)
  })

  it('handles edge cases for age recommendations', () => {
    const { result } = renderHook(() => useAgeTierFilter())

    expect(result.current.getRecommendedTier(12)).toBe(AgeTier.CHILDREN) // boundary
    expect(result.current.getRecommendedTier(13)).toBe(AgeTier.YOUTH)
    expect(result.current.getRecommendedTier(17)).toBe(AgeTier.YOUTH)
    expect(result.current.getRecommendedTier(18)).toBe(AgeTier.ADULTS)
    expect(result.current.getRecommendedTier(59)).toBe(AgeTier.ADULTS)
    expect(result.current.getRecommendedTier(60)).toBe(AgeTier.SENIORS)
  })
})