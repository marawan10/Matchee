"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Star, Plus, X, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { storageService } from '@/lib/storage'
import { cn } from '@/lib/utils'

interface Team {
  id: number
  name: string
  logo: string
  league: string
}

interface League {
  id: number
  name: string
  country: string
  logo: string
}

export function FavoritesManager() {
  const [favoriteTeams, setFavoriteTeams] = useState<number[]>([])
  const [favoriteLeagues, setFavoriteLeagues] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'teams' | 'leagues'>('teams')

  // Mock data - in real app, this would come from API
  const popularTeams: Team[] = [
    { id: 33, name: 'Manchester United', logo: '/teams/man-utd.png', league: 'Premier League' },
    { id: 40, name: 'Liverpool', logo: '/teams/liverpool.png', league: 'Premier League' },
    { id: 50, name: 'Manchester City', logo: '/teams/man-city.png', league: 'Premier League' },
    { id: 49, name: 'Chelsea', logo: '/teams/chelsea.png', league: 'Premier League' },
    { id: 529, name: 'Barcelona', logo: '/teams/barcelona.png', league: 'La Liga' },
    { id: 541, name: 'Real Madrid', logo: '/teams/real-madrid.png', league: 'La Liga' },
  ]

  const popularLeagues: League[] = [
    { id: 39, name: 'Premier League', country: 'England', logo: '/leagues/premier-league.png' },
    { id: 140, name: 'La Liga', country: 'Spain', logo: '/leagues/la-liga.png' },
    { id: 78, name: 'Bundesliga', country: 'Germany', logo: '/leagues/bundesliga.png' },
    { id: 61, name: 'Ligue 1', country: 'France', logo: '/leagues/ligue1.png' },
    { id: 135, name: 'Serie A', country: 'Italy', logo: '/leagues/serie-a.png' },
  ]

  useEffect(() => {
    setFavoriteTeams(storageService.getFavoriteTeams())
    setFavoriteLeagues(storageService.getFavoriteLeagues())
  }, [])

  const toggleFavoriteTeam = (teamId: number) => {
    if (favoriteTeams.includes(teamId)) {
      storageService.removeFavoriteTeam(teamId)
      setFavoriteTeams(prev => prev.filter(id => id !== teamId))
    } else {
      storageService.addFavoriteTeam(teamId)
      setFavoriteTeams(prev => [...prev, teamId])
    }
  }

  const toggleFavoriteLeague = (leagueId: number) => {
    if (favoriteLeagues.includes(leagueId)) {
      storageService.removeFavoriteLeague(leagueId)
      setFavoriteLeagues(prev => prev.filter(id => id !== leagueId))
    } else {
      storageService.addFavoriteLeague(leagueId)
      setFavoriteLeagues(prev => [...prev, leagueId])
    }
  }

  const filteredTeams = popularTeams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredLeagues = popularLeagues.filter(league =>
    league.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    league.country.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-500" />
            <span>My Favorites</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search teams or leagues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border bg-background pl-10 pr-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-muted/50 p-1 rounded-lg w-fit">
            <Button
              variant={activeTab === 'teams' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('teams')}
            >
              Teams ({favoriteTeams.length})
            </Button>
            <Button
              variant={activeTab === 'leagues' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('leagues')}
            >
              Leagues ({favoriteLeagues.length})
            </Button>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'teams' ? (
              <motion.div
                key="teams"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-2"
              >
                {filteredTeams.map((team) => (
                  <motion.div
                    key={team.id}
                    layout
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                        <span className="text-xs font-bold">
                          {team.name.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{team.name}</p>
                        <p className="text-sm text-muted-foreground">{team.league}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFavoriteTeam(team.id)}
                      className="shrink-0"
                    >
                      <motion.div
                        animate={favoriteTeams.includes(team.id) ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        <Heart
                          className={cn(
                            "h-4 w-4 transition-colors",
                            favoriteTeams.includes(team.id)
                              ? "fill-red-500 text-red-500"
                              : "text-muted-foreground"
                          )}
                        />
                      </motion.div>
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="leagues"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-2"
              >
                {filteredLeagues.map((league) => (
                  <motion.div
                    key={league.id}
                    layout
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                        <span className="text-xs font-bold">
                          {league.name.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{league.name}</p>
                        <p className="text-sm text-muted-foreground">{league.country}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFavoriteLeague(league.id)}
                      className="shrink-0"
                    >
                      <motion.div
                        animate={favoriteLeagues.includes(league.id) ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        <Star
                          className={cn(
                            "h-4 w-4 transition-colors",
                            favoriteLeagues.includes(league.id)
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-muted-foreground"
                          )}
                        />
                      </motion.div>
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty State */}
          {((activeTab === 'teams' && filteredTeams.length === 0) ||
            (activeTab === 'leagues' && filteredLeagues.length === 0)) && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No {activeTab} found</p>
              <p className="text-sm">Try adjusting your search</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* My Feed Preview */}
      {(favoriteTeams.length > 0 || favoriteLeagues.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">My Feed Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {favoriteTeams.slice(0, 3).map((teamId) => {
                const team = popularTeams.find(t => t.id === teamId)
                return team ? (
                  <Badge key={teamId} variant="secondary">
                    {team.name}
                  </Badge>
                ) : null
              })}
              {favoriteLeagues.slice(0, 2).map((leagueId) => {
                const league = popularLeagues.find(l => l.id === leagueId)
                return league ? (
                  <Badge key={leagueId} variant="outline">
                    {league.name}
                  </Badge>
                ) : null
              })}
              {(favoriteTeams.length + favoriteLeagues.length) > 5 && (
                <Badge variant="secondary">
                  +{(favoriteTeams.length + favoriteLeagues.length) - 5} more
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
