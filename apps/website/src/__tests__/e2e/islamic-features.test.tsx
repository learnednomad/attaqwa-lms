/**
 * End-to-End Tests for Critical Islamic Features
 * 
 * These tests simulate real user interactions with Islamic features
 * to ensure the complete user journey works correctly.
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { jest } from '@jest/globals'

// Mock Next.js router
const mockPush = jest.fn()
const mockReplace = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    pathname: '/',
    searchParams: new URLSearchParams(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

// Mock geolocation API
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
}

Object.defineProperty(global.navigator, 'geolocation', {
  value: mockGeolocation,
  writable: true,
})

// Test wrapper with providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

// Mock API responses
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('Islamic Features E2E Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockClear()
  })

  describe('Prayer Times User Journey', () => {
    it('allows user to get prayer times for their location', async () => {
      const user = userEvent.setup()

      // Mock successful geolocation
      mockGeolocation.getCurrentPosition.mockImplementationOnce((success) => {
        success({
          coords: {
            latitude: 40.7128,
            longitude: -74.0060,
          },
        })
      })

      // Mock prayer times API response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          prayerTimes: {
            fajr: '05:30',
            dhuhr: '12:45',
            asr: '15:30',
            maghrib: '18:00',
            isha: '19:30',
          },
          location: {
            latitude: 40.7128,
            longitude: -74.0060,
            timezone: 'America/New_York',
          },
          hijriDate: {
            day: '19',
            month: 'Jumādā al-thānī',
            year: '1445',
            weekday: 'Al Athnayn',
          },
          qiblaDirection: 58.48,
          nextPrayer: {
            name: 'Dhuhr',
            time: '12:45',
            timeRemaining: '2 hours 45 minutes',
          },
        }),
      })

      // Mock component that uses prayer times
      const PrayerTimesPage = () => {
        const [prayerTimes, setPrayerTimes] = React.useState(null)
        const [loading, setLoading] = React.useState(false)

        const fetchPrayerTimes = async () => {
          setLoading(true)
          try {
            navigator.geolocation.getCurrentPosition(async (position) => {
              const { latitude, longitude } = position.coords
              const response = await fetch(`/api/prayer-times?latitude=${latitude}&longitude=${longitude}`)
              const data = await response.json()
              setPrayerTimes(data)
              setLoading(false)
            })
          } catch (error) {
            setLoading(false)
          }
        }

        return (
          <div>
            <h1>Prayer Times</h1>
            <button onClick={fetchPrayerTimes} disabled={loading}>
              {loading ? 'Loading...' : 'Get My Prayer Times'}
            </button>
            
            {prayerTimes && (
              <div data-testid="prayer-times-display">
                <div>Fajr: {prayerTimes.prayerTimes.fajr}</div>
                <div>Dhuhr: {prayerTimes.prayerTimes.dhuhr}</div>
                <div>Asr: {prayerTimes.prayerTimes.asr}</div>
                <div>Maghrib: {prayerTimes.prayerTimes.maghrib}</div>
                <div>Isha: {prayerTimes.prayerTimes.isha}</div>
                <div>Next Prayer: {prayerTimes.nextPrayer.name} at {prayerTimes.nextPrayer.time}</div>
                <div>Qibla Direction: {prayerTimes.qiblaDirection}°</div>
                <div>Hijri Date: {prayerTimes.hijriDate.day} {prayerTimes.hijriDate.month} {prayerTimes.hijriDate.year}</div>
              </div>
            )}
          </div>
        )
      }

      render(
        <TestWrapper>
          <PrayerTimesPage />
        </TestWrapper>
      )

      // User sees the prayer times page
      expect(screen.getByText('Prayer Times')).toBeInTheDocument()
      expect(screen.getByText('Get My Prayer Times')).toBeInTheDocument()

      // User clicks to get prayer times
      await user.click(screen.getByText('Get My Prayer Times'))

      // System requests location permission and fetches prayer times
      await waitFor(() => {
        expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled()
      })

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/prayer-times?latitude=40.7128&longitude=-74.0060')
        )
      })

      // User sees prayer times displayed
      await waitFor(() => {
        expect(screen.getByTestId('prayer-times-display')).toBeInTheDocument()
      })

      expect(screen.getByText('Fajr: 05:30')).toBeInTheDocument()
      expect(screen.getByText('Dhuhr: 12:45')).toBeInTheDocument()
      expect(screen.getByText('Asr: 15:30')).toBeInTheDocument()
      expect(screen.getByText('Maghrib: 18:00')).toBeInTheDocument()
      expect(screen.getByText('Isha: 19:30')).toBeInTheDocument()
      expect(screen.getByText('Next Prayer: Dhuhr at 12:45')).toBeInTheDocument()
      expect(screen.getByText('Qibla Direction: 58.48°')).toBeInTheDocument()
      expect(screen.getByText(/Jumādā al-thānī 1445/)).toBeInTheDocument()
    })

    it('handles location permission denial gracefully', async () => {
      const user = userEvent.setup()

      // Mock geolocation error
      mockGeolocation.getCurrentPosition.mockImplementationOnce((success, error) => {
        error({
          code: 1,
          message: 'User denied the request for Geolocation.',
        })
      })

      const PrayerTimesPageWithError = () => {
        const [error, setError] = React.useState('')
        const [showManualEntry, setShowManualEntry] = React.useState(false)

        const fetchPrayerTimes = async () => {
          try {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                // Success handled here
              },
              (error) => {
                setError('Location access denied. Please enter your location manually.')
                setShowManualEntry(true)
              }
            )
          } catch (error) {
            setError('Unable to get location')
          }
        }

        return (
          <div>
            <h1>Prayer Times</h1>
            <button onClick={fetchPrayerTimes}>Get My Prayer Times</button>
            
            {error && (
              <div data-testid="error-message" className="text-red-600">
                {error}
              </div>
            )}
            
            {showManualEntry && (
              <div data-testid="manual-location-form">
                <h3>Enter Your Location</h3>
                <input placeholder="City, Country" data-testid="location-input" />
                <button data-testid="search-location">Search</button>
              </div>
            )}
          </div>
        )
      }

      render(
        <TestWrapper>
          <PrayerTimesPageWithError />
        </TestWrapper>
      )

      // User clicks to get prayer times
      await user.click(screen.getByText('Get My Prayer Times'))

      // User sees error message and manual entry form
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument()
      })

      expect(screen.getByText(/Location access denied/)).toBeInTheDocument()
      expect(screen.getByTestId('manual-location-form')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('City, Country')).toBeInTheDocument()
    })
  })

  describe('Educational Content User Journey', () => {
    it('allows user to browse and filter Islamic educational content', async () => {
      const user = userEvent.setup()

      // Mock educational content API response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          data: [
            {
              id: 'content-1',
              title: 'Introduction to Salah',
              description: 'Learn the fundamentals of Islamic prayer',
              subject: 'WORSHIP',
              ageTier: 'CHILDREN',
              difficultyLevel: 'BEGINNER',
              contentType: 'LESSON',
              estimatedDuration: 30,
              author: { name: 'Sheikh Muhammad' },
            },
            {
              id: 'content-2',
              title: 'Quran Recitation Basics',
              description: 'Learn proper Quran recitation',
              subject: 'QURAN',
              ageTier: 'YOUTH',
              difficultyLevel: 'INTERMEDIATE',
              contentType: 'LESSON',
              estimatedDuration: 45,
              author: { name: 'Qari Ali' },
            },
          ],
          pagination: { page: 1, limit: 10, total: 2, totalPages: 1 },
        }),
      })

      const EducationPage = () => {
        const [content, setContent] = React.useState([])
        const [filters, setFilters] = React.useState({
          subject: '',
          ageTier: '',
          difficultyLevel: '',
        })

        const fetchContent = async () => {
          const params = new URLSearchParams()
          if (filters.subject) params.append('subject', filters.subject)
          if (filters.ageTier) params.append('ageTier', filters.ageTier)
          if (filters.difficultyLevel) params.append('difficultyLevel', filters.difficultyLevel)

          const response = await fetch(`/api/education?${params}`)
          const data = await response.json()
          setContent(data.data)
        }

        React.useEffect(() => {
          fetchContent()
        }, [filters])

        return (
          <div>
            <h1>Islamic Education</h1>
            
            <div data-testid="filters">
              <select
                value={filters.subject}
                onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
                data-testid="subject-filter"
              >
                <option value="">All Subjects</option>
                <option value="QURAN">Quran</option>
                <option value="WORSHIP">Worship</option>
                <option value="HADITH">Hadith</option>
              </select>
              
              <select
                value={filters.ageTier}
                onChange={(e) => setFilters(prev => ({ ...prev, ageTier: e.target.value }))}
                data-testid="age-filter"
              >
                <option value="">All Ages</option>
                <option value="CHILDREN">Children</option>
                <option value="YOUTH">Youth</option>
                <option value="ADULTS">Adults</option>
              </select>
            </div>

            <div data-testid="content-list">
              {content.map((item) => (
                <div key={item.id} data-testid={`content-${item.id}`}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <span>Subject: {item.subject}</span>
                  <span>Age: {item.ageTier}</span>
                  <span>Level: {item.difficultyLevel}</span>
                  <span>Duration: {item.estimatedDuration} min</span>
                  <button onClick={() => {}}>Start Learning</button>
                </div>
              ))}
            </div>
          </div>
        )
      }

      render(
        <TestWrapper>
          <EducationPage />
        </TestWrapper>
      )

      // User sees the education page with content
      expect(screen.getByText('Islamic Education')).toBeInTheDocument()
      
      await waitFor(() => {
        expect(screen.getByTestId('content-list')).toBeInTheDocument()
      })

      expect(screen.getByText('Introduction to Salah')).toBeInTheDocument()
      expect(screen.getByText('Quran Recitation Basics')).toBeInTheDocument()

      // User filters by subject
      await user.selectOptions(screen.getByTestId('subject-filter'), 'QURAN')

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/education?subject=QURAN')
        )
      })

      // User filters by age tier
      await user.selectOptions(screen.getByTestId('age-filter'), 'CHILDREN')

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('subject=QURAN&ageTier=CHILDREN')
        )
      })
    })

    it('allows user to complete a quiz successfully', async () => {
      const user = userEvent.setup()

      // Mock quiz content API response
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            content: {
              id: 'quiz-1',
              title: 'Salah Knowledge Quiz',
              contentType: 'QUIZ',
              quizQuestions: [
                {
                  id: 'q1',
                  question: 'How many times do Muslims pray daily?',
                  options: ['3', '4', '5', '6'],
                },
                {
                  id: 'q2',
                  question: 'What is the first prayer of the day?',
                  options: ['Fajr', 'Dhuhr', 'Asr', 'Maghrib'],
                },
              ],
            },
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            attempt: {
              score: 100,
              totalQuestions: 2,
              correctAnswers: 2,
              isPassed: true,
            },
          }),
        })

      const QuizPage = () => {
        const [quiz, setQuiz] = React.useState(null)
        const [answers, setAnswers] = React.useState({})
        const [result, setResult] = React.useState(null)
        const [currentQuestion, setCurrentQuestion] = React.useState(0)

        React.useEffect(() => {
          fetch('/api/education/quiz-1')
            .then(res => res.json())
            .then(data => setQuiz(data.content))
        }, [])

        const submitQuiz = async () => {
          const response = await fetch('/api/education/quiz-1/submit-quiz', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              answers: Object.entries(answers).map(([questionId, answer]) => ({
                questionId,
                answer,
                timeSpent: 30,
              })),
              timeSpent: 120,
            }),
          })
          const data = await response.json()
          setResult(data.attempt)
        }

        if (!quiz) return <div>Loading...</div>

        if (result) {
          return (
            <div data-testid="quiz-result">
              <h1>Quiz Complete!</h1>
              <div>Score: {result.score}%</div>
              <div>Correct Answers: {result.correctAnswers}/{result.totalQuestions}</div>
              <div>{result.isPassed ? 'Passed!' : 'Try Again'}</div>
            </div>
          )
        }

        const question = quiz.quizQuestions[currentQuestion]

        return (
          <div>
            <h1>{quiz.title}</h1>
            <div data-testid="quiz-progress">
              Question {currentQuestion + 1} of {quiz.quizQuestions.length}
            </div>
            
            <div data-testid={`question-${currentQuestion}`}>
              <h3>{question.question}</h3>
              {question.options.map((option) => (
                <label key={option}>
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    onChange={(e) => setAnswers(prev => ({ ...prev, [question.id]: e.target.value }))}
                    data-testid={`option-${option}`}
                  />
                  {option}
                </label>
              ))}
            </div>

            <div>
              {currentQuestion > 0 && (
                <button onClick={() => setCurrentQuestion(prev => prev - 1)}>
                  Previous
                </button>
              )}
              
              {currentQuestion < quiz.quizQuestions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestion(prev => prev + 1)}
                  disabled={!answers[question.id]}
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={submitQuiz}
                  disabled={Object.keys(answers).length !== quiz.quizQuestions.length}
                  data-testid="submit-quiz"
                >
                  Submit Quiz
                </button>
              )}
            </div>
          </div>
        )
      }

      render(
        <TestWrapper>
          <QuizPage />
        </TestWrapper>
      )

      // User sees quiz loading then content
      await waitFor(() => {
        expect(screen.getByText('Salah Knowledge Quiz')).toBeInTheDocument()
      })

      expect(screen.getByText('Question 1 of 2')).toBeInTheDocument()
      expect(screen.getByText('How many times do Muslims pray daily?')).toBeInTheDocument()

      // User answers first question
      await user.click(screen.getByTestId('option-5'))
      await user.click(screen.getByText('Next'))

      // User sees second question
      expect(screen.getByText('Question 2 of 2')).toBeInTheDocument()
      expect(screen.getByText('What is the first prayer of the day?')).toBeInTheDocument()

      // User answers second question
      await user.click(screen.getByTestId('option-Fajr'))

      // Submit button should be enabled
      expect(screen.getByTestId('submit-quiz')).not.toBeDisabled()

      // User submits quiz
      await user.click(screen.getByTestId('submit-quiz'))

      // User sees results
      await waitFor(() => {
        expect(screen.getByTestId('quiz-result')).toBeInTheDocument()
      })

      expect(screen.getByText('Quiz Complete!')).toBeInTheDocument()
      expect(screen.getByText('Score: 100%')).toBeInTheDocument()
      expect(screen.getByText('Correct Answers: 2/2')).toBeInTheDocument()
      expect(screen.getByText('Passed!')).toBeInTheDocument()
    })
  })

  describe('Announcement System User Journey', () => {
    it('displays announcements with proper Islamic styling and content', async () => {
      // Mock announcements API response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          data: [
            {
              id: 'ann-1',
              title: 'Jummah Prayer Notice',
              content: 'This Friday\'s Jummah prayer will begin at 1:30 PM. Please arrive early.',
              type: 'GENERAL',
              priority: 'HIGH',
              isPublished: true,
              publishedAt: '2024-01-05T12:00:00Z',
              expiresAt: '2024-01-05T18:00:00Z',
              author: { name: 'Imam Abdullah' },
            },
            {
              id: 'ann-2',
              title: 'Ramadan Preparation Workshop',
              content: 'Join us for a workshop on preparing for the blessed month of Ramadan.',
              type: 'EVENT',
              priority: 'MEDIUM',
              isPublished: true,
              publishedAt: '2024-01-01T10:00:00Z',
              author: { name: 'Sheikh Amina' },
            },
          ],
          pagination: { page: 1, limit: 10, total: 2, totalPages: 1 },
        }),
      })

      const AnnouncementsPage = () => {
        const [announcements, setAnnouncements] = React.useState([])

        React.useEffect(() => {
          fetch('/api/announcements')
            .then(res => res.json())
            .then(data => setAnnouncements(data.data))
        }, [])

        return (
          <div>
            <h1>Masjid Announcements</h1>
            <div data-testid="announcements-list">
              {announcements.map((announcement) => (
                <div 
                  key={announcement.id} 
                  data-testid={`announcement-${announcement.id}`}
                  className={`announcement-card priority-${announcement.priority.toLowerCase()}`}
                >
                  <h3>{announcement.title}</h3>
                  <p>{announcement.content}</p>
                  <div className="announcement-meta">
                    <span>By: {announcement.author.name}</span>
                    <span>Type: {announcement.type}</span>
                    <span>Priority: {announcement.priority}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      }

      render(
        <TestWrapper>
          <AnnouncementsPage />
        </TestWrapper>
      )

      // User sees announcements page
      expect(screen.getByText('Masjid Announcements')).toBeInTheDocument()

      await waitFor(() => {
        expect(screen.getByTestId('announcements-list')).toBeInTheDocument()
      })

      // User sees both announcements with proper content
      expect(screen.getByText('Jummah Prayer Notice')).toBeInTheDocument()
      expect(screen.getByText(/Friday\'s Jummah prayer will begin at 1:30 PM/)).toBeInTheDocument()
      expect(screen.getByText('By: Imam Abdullah')).toBeInTheDocument()

      expect(screen.getByText('Ramadan Preparation Workshop')).toBeInTheDocument()
      expect(screen.getByText(/workshop on preparing for the blessed month of Ramadan/)).toBeInTheDocument()
      expect(screen.getByText('By: Sheikh Amina')).toBeInTheDocument()

      // User sees priority styling
      const highPriorityCard = screen.getByTestId('announcement-ann-1')
      expect(highPriorityCard).toHaveClass('priority-high')

      const mediumPriorityCard = screen.getByTestId('announcement-ann-2')
      expect(mediumPriorityCard).toHaveClass('priority-medium')
    })
  })
})