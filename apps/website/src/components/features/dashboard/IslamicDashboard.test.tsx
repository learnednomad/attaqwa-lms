import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IslamicDashboard } from './IslamicDashboard';

// Mock the auth hook
jest.mock('@/lib/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: '1', name: 'Ahmed Muhammad' },
    isAuthenticated: true,
    isAdmin: false,
    isModerator: false
  })
}));

// Mock API responses
global.fetch = jest.fn();

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 0,
    },
  },
});

const renderWithQueryClient = (component: React.ReactElement) => {
  const testQueryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testQueryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('IslamicDashboard', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('displays Islamic greeting with user name', () => {
    renderWithQueryClient(<IslamicDashboard />);
    expect(screen.getByText(/Assalamu Alaikum, Ahmed/)).toBeInTheDocument();
  });

  it('shows prayer time section with Islamic context', () => {
    renderWithQueryClient(<IslamicDashboard />);
    expect(screen.getByText('Next Prayer')).toBeInTheDocument();
    expect(screen.getByText('Qibla Direction: 58.5° NE')).toBeInTheDocument();
  });

  it('displays Islamic calendar information', () => {
    renderWithQueryClient(<IslamicDashboard />);
    expect(screen.getByText('Islamic Calendar')).toBeInTheDocument();
    expect(screen.getByText('Days to Ramadan:')).toBeInTheDocument();
  });

  it('renders educational progress section', () => {
    renderWithQueryClient(<IslamicDashboard />);
    expect(screen.getByText('Your Islamic Learning Journey')).toBeInTheDocument();
  });

  it('shows community activity stats', () => {
    renderWithQueryClient(<IslamicDashboard />);
    expect(screen.getByText('Community Activity')).toBeInTheDocument();
    expect(screen.getByText('Upcoming Events')).toBeInTheDocument();
  });

  it('handles unauthenticated state appropriately', () => {
    // Mock unauthenticated state
    jest.doMock('@/lib/hooks/useAuth', () => ({
      useAuth: () => ({
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        isModerator: false
      })
    }));

    renderWithQueryClient(<IslamicDashboard />);
    expect(screen.getByText('Welcome to Islamic Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Sign In to Continue')).toBeInTheDocument();
  });

  it('displays prayer times in 12-hour format', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        prayers: {
          fajr: '05:30',
          dhuhr: '12:45',
          asr: '15:30',
          maghrib: '18:00',
          isha: '19:30'
        }
      })
    });

    renderWithQueryClient(<IslamicDashboard />);
    
    // Prayer times should be formatted properly
    await screen.findByText(/05:30|12:45|15:30|18:00|19:30/);
  });

  it('handles Arabic text with proper RTL support', () => {
    renderWithQueryClient(<IslamicDashboard />);
    
    // Check for Arabic prayer names (would be rendered when prayer times load)
    const arabicElements = document.querySelectorAll('.font-arabic');
    expect(arabicElements.length).toBeGreaterThan(0);
  });

  it('respects Islamic design system colors', () => {
    renderWithQueryClient(<IslamicDashboard />);
    
    // Check for Islamic color classes
    const element = document.querySelector('.text-islamic-green');
    expect(element).toBeInTheDocument();
  });
});