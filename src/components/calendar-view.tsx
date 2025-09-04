"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, ChevronLeft, ChevronRight, Clock, Bell, BellOff } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Match } from '@/types/match'
import { getMatches } from '@/lib/api/football-api'
import { cn, formatTime } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'

interface CalendarDay {
  date: Date
  matches: Match[]
  isToday: boolean
  isCurrentMonth: boolean
}

export function CalendarView() {
  const { t, formatDate } = useTranslation()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [matches, setMatches] = useState<Match[]>([])
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([])
  const [loading, setLoading] = useState(true)
  const [reminders, setReminders] = useState<Set<number>>(new Set())

  useEffect(() => {
    fetchMatches()
  }, [])

  useEffect(() => {
    generateCalendarDays()
  }, [currentDate, matches])

  const fetchMatches = async () => {
    try {
      // Fetch matches for a wider date range to populate calendar
      const today = new Date()
      const startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      const endDate = new Date(today.getFullYear(), today.getMonth() + 2, 0)
      
      const dateFrom = startDate.toISOString().split('T')[0]
      const dateTo = endDate.toISOString().split('T')[0]
      
      console.log('📅 Fetching matches for calendar range:', { dateFrom, dateTo })
      const data = await getMatches(dateFrom, dateTo)
      setMatches(data)
    } catch (error) {
      console.error('Failed to fetch matches:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days: CalendarDay[] = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      
      const dayMatches = matches.filter(match => {
        const matchDate = new Date(match.fixture.date)
        return matchDate.toDateString() === date.toDateString()
      })
      
      days.push({
        date: new Date(date),
        matches: dayMatches,
        isToday: date.toDateString() === today.toDateString(),
        isCurrentMonth: date.getMonth() === month
      })
    }
    
    setCalendarDays(days)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1))
    setCurrentDate(newDate)
  }

  const toggleReminder = (matchId: number) => {
    const newReminders = new Set(reminders)
    if (newReminders.has(matchId)) {
      newReminders.delete(matchId)
    } else {
      newReminders.add(matchId)
    }
    setReminders(newReminders)
  }

  const selectedDayMatches = calendarDays.find(day => 
    day.date.toDateString() === selectedDate.toDateString()
  )?.matches || []

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>{t('calendar')}</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="min-w-[120px] text-center font-semibold">
                {currentDate.toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
            {calendarDays.map((day, index) => (
              <motion.button
                key={index}
                onClick={() => setSelectedDate(day.date)}
                className={cn(
                  "relative p-2 text-sm rounded-lg transition-all hover:bg-muted",
                  day.isToday && "bg-primary text-primary-foreground font-bold",
                  !day.isCurrentMonth && "text-muted-foreground opacity-50",
                  selectedDate.toDateString() === day.date.toDateString() && 
                  !day.isToday && "bg-muted ring-2 ring-primary"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div>{day.date.getDate()}</div>
                {day.matches.length > 0 && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      day.matches.some(m => ['1H', '2H', 'HT'].includes(m.fixture.status.short))
                        ? "bg-green-500 animate-pulse"
                        : "bg-blue-500"
                    )} />
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Day Matches */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {formatDate(selectedDate)} - {selectedDayMatches.length} {selectedDayMatches.length === 1 ? 'Match' : 'Matches'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {selectedDayMatches.length > 0 ? (
              <motion.div
                key={selectedDate.toDateString()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-3"
              >
                {selectedDayMatches.map((match, index) => (
                  <motion.div
                    key={match.fixture.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 min-w-[60px]">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {formatTime(new Date(match.fixture.date))}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-muted rounded flex items-center justify-center">
                            <span className="text-xs font-bold">
                              {match.teams.home.name.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium">{match.teams.home.name}</span>
                        </div>
                        
                        <span className="text-muted-foreground">vs</span>
                        
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-muted rounded flex items-center justify-center">
                            <span className="text-xs font-bold">
                              {match.teams.away.name.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium">{match.teams.away.name}</span>
                        </div>
                      </div>
                      
                      <Badge variant="outline" className="text-xs">
                        {match.league.name}
                      </Badge>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleReminder(match.fixture.id)}
                      className="shrink-0"
                    >
                      {reminders.has(match.fixture.id) ? (
                        <Bell className="h-4 w-4 text-primary" />
                      ) : (
                        <BellOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="no-matches"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-muted-foreground"
              >
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{t('noMatches')}</p>
                <p className="text-sm">Select a different date to see matches</p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}
