"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Clock, MapPin, Users, TrendingUp, Play, Pause, Target, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MatchTimeline } from '@/components/match-timeline'
import { MatchStats } from '@/components/match-stats'
import { FormationView } from '@/components/formation-view'
import { footballApi } from '@/lib/api/football-api'
import { Match } from '@/types/match'
import { cn, getMatchStatus, getStatusColor, formatTime } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface MatchDetailViewProps {
  matchId: string
}

export function MatchDetailView({ matchId }: MatchDetailViewProps) {
  const router = useRouter()
  const [match, setMatch] = useState<Match | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'timeline' | 'stats' | 'lineups'>('timeline')

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        // For demo purposes, use mock data
        const mockMatch: Match = {
          fixture: {
            id: parseInt(matchId),
            date: new Date().toISOString(),
            timestamp: Date.now() / 1000,
            timezone: 'UTC',
            periods: { first: 1693834800, second: 1693838400 },
            venue: { id: 1, name: 'Old Trafford', city: 'Manchester' },
            status: { long: 'Second Half', short: '2H', elapsed: 67 }
          },
          league: {
            id: 39,
            name: 'Premier League',
            country: 'England',
            logo: 'https://media.api-sports.io/football/leagues/39.png',
            flag: 'https://media.api-sports.io/flags/gb.svg',
            season: 2024
          },
          teams: {
            home: {
              id: 33,
              name: 'Manchester United',
              logo: 'https://media.api-sports.io/football/teams/33.png'
            },
            away: {
              id: 40,
              name: 'Liverpool',
              logo: 'https://media.api-sports.io/football/teams/40.png'
            }
          },
          goals: { home: 2, away: 1 },
          score: {
            halftime: { home: 1, away: 0 },
            fulltime: { home: null, away: null }
          },
          events: [
            {
              time: { elapsed: 23 },
              team: { id: 33, name: 'Manchester United', logo: '' },
              player: { id: 1, name: 'Marcus Rashford' },
              type: 'Goal',
              detail: 'Normal Goal'
            },
            {
              time: { elapsed: 45 },
              team: { id: 40, name: 'Liverpool', logo: '' },
              player: { id: 2, name: 'Mohamed Salah' },
              type: 'Goal',
              detail: 'Normal Goal'
            },
            {
              time: { elapsed: 58 },
              team: { id: 33, name: 'Manchester United', logo: '' },
              player: { id: 3, name: 'Bruno Fernandes' },
              type: 'Goal',
              detail: 'Penalty'
            }
          ]
        }
        setMatch(mockMatch)
      } catch (error) {
        console.error('Failed to fetch match details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMatchDetails()
  }, [matchId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Activity className="h-8 w-8 text-primary" />
        </motion.div>
      </div>
    )
  }

  if (!match) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Match not found</p>
      </div>
    )
  }

  const isLive = ['1H', '2H', 'HT'].includes(match.fixture.status.short)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold truncate">Match Details</h1>
          <p className="text-muted-foreground text-sm sm:text-base truncate">{match.league.name}</p>
        </div>
      </div>

      {/* Match Header Card */}
      <Card className={cn(
        "relative overflow-hidden",
        isLive && "ring-2 ring-green-500/20"
      )}>
        <CardContent className="p-6">
          {/* Live indicator */}
          {isLive && (
            <div className="absolute top-4 right-4">
              <div className="flex items-center space-x-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                <div className="h-2 w-2 bg-white rounded-full animate-pulse" />
                <span>LIVE</span>
              </div>
            </div>
          )}

          <div className="space-y-4 sm:space-y-6">
            {/* Teams and Score */}
            <div className="grid grid-cols-3 items-center gap-2 sm:gap-4">
              {/* Home Team */}
              <div className="text-center space-y-2">
                <img 
                  src={match.teams.home.logo} 
                  alt={match.teams.home.name}
                  className="h-12 w-12 sm:h-16 sm:w-16 mx-auto rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-team.png'
                  }}
                />
                <h3 className="font-semibold text-sm sm:text-lg leading-tight">{match.teams.home.name}</h3>
              </div>

              {/* Score and Status */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-2 sm:space-x-4">
                  <motion.span 
                    className="text-2xl sm:text-4xl font-bold"
                    key={`home-${match.goals.home}`}
                    initial={isLive ? { scale: 1.2 } : false}
                    animate={isLive ? { scale: 1 } : false}
                    style={isLive ? { color: '#10b981' } : {}}
                  >
                    {match.goals.home ?? 0}
                  </motion.span>
                  <span className="text-lg sm:text-2xl text-muted-foreground">-</span>
                  <motion.span 
                    className="text-2xl sm:text-4xl font-bold"
                    key={`away-${match.goals.away}`}
                    initial={isLive ? { scale: 1.2 } : false}
                    animate={isLive ? { scale: 1 } : false}
                    style={isLive ? { color: '#10b981' } : {}}
                  >
                    {match.goals.away ?? 0}
                  </motion.span>
                </div>
                <div className={cn(
                  "inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium",
                  getStatusColor(match.fixture.status.short)
                )}>
                  <Clock className="h-3 w-3 mr-1" />
                  <span className="truncate">{getMatchStatus(match.fixture.status.short, match.fixture.status.elapsed)}</span>
                </div>
              </div>

              {/* Away Team */}
              <div className="text-center space-y-2">
                <img 
                  src={match.teams.away.logo} 
                  alt={match.teams.away.name}
                  className="h-12 w-12 sm:h-16 sm:w-16 mx-auto rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-team.png'
                  }}
                />
                <h3 className="font-semibold text-sm sm:text-lg leading-tight">{match.teams.away.name}</h3>
              </div>
            </div>

            {/* Match Info */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-muted-foreground border-t pt-4">
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="truncate">{match.fixture.venue.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="whitespace-nowrap">{formatTime(new Date(match.fixture.date))}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted/50 p-1 rounded-lg w-fit overflow-x-auto scrollbar-hide">
        {[
          { key: 'timeline', label: 'Timeline', icon: Activity },
          { key: 'stats', label: 'Statistics', icon: TrendingUp },
          { key: 'lineups', label: 'Lineups', icon: Users },
        ].map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant={activeTab === key ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab(key as typeof activeTab)}
            className="transition-all duration-200 whitespace-nowrap shrink-0"
          >
            <Icon className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden text-xs">{label.slice(0, 4)}</span>
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'timeline' && <MatchTimeline match={match} />}
          {activeTab === 'stats' && <MatchStats match={match} />}
          {activeTab === 'lineups' && <FormationView match={match} />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
