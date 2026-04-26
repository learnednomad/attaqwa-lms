import { cn } from './utils'

describe('cn()', () => {
  it('joins class names', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('dedupes tailwind conflicts, keeping the last winner', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('drops falsy inputs', () => {
    expect(cn('a', false && 'b', null, undefined, 0 && 'c', 'd')).toBe('a d')
  })

  it('handles conditional objects', () => {
    expect(cn('base', { active: true, disabled: false })).toBe('base active')
  })

  it('flattens nested arrays', () => {
    expect(cn(['a', ['b', ['c']]])).toBe('a b c')
  })
})
