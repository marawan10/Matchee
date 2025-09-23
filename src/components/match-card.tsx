"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, MapPin, Users, TrendingUp, Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Match } from '@/types/match'
import { cn, getMatchStatus, getStatusColor, formatTime } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface MatchCardProps {
  match: Match
}

export function MatchCard({ match }: MatchCardProps) {
  const router = useRouter()
  const [isFavorite, setIsFavorite] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const isLive = ['1H', '2H', 'HT'].includes(match.fixture.status.short)
  const isFinished = match.fixture.status.short === 'FT'
  
  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite)
  }

  const handleCardClick = () => {
    router.push(`/match/${match.fixture.id}`)
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group"
    >
      <Card 
        className={cn(
          "relative overflow-hidden transition-all duration-300 cursor-pointer",
          "hover:shadow-lg hover:shadow-primary/10",
          isLive && "ring-2 ring-green-500/20 shadow-green-500/10",
          "glass backdrop-blur-sm"
        )}
        onClick={handleCardClick}
      >
        {/* Live indicator */}
        {isLive && (
          <div className="absolute top-2 right-2 z-10">
            <div className="flex items-center space-x-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              <div className="h-2 w-2 bg-white rounded-full animate-pulse" />
              <span>LIVE</span>
            </div>
          </div>
        )}

        {/* Favorite button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 left-2 z-10 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation()
            handleFavoriteToggle()
          }}
        >
          <motion.div
            animate={isFavorite ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <Heart 
              className={cn(
                "h-4 w-4 transition-colors",
                isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
              )} 
            />
          </motion.div>
        </Button>

        <CardContent className="p-4 space-y-4">
          {/* League info */}
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
            <img 
              src={match.league.logo} 
              alt={match.league.name}
              className="h-4 w-4 rounded shrink-0"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-league.png'
              }}
            />
            <span className="truncate flex-1 min-w-0">{match.league.name}</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline whitespace-nowrap">{formatTime(new Date(match.fixture.date))}</span>
          </div>

          {/* Teams and score */}
          <div className="space-y-3">
            {/* Home team */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                <img 
                  src={match.teams.home.logo} 
                  alt={match.teams.home.name}
                  className="h-6 w-6 sm:h-8 sm:w-8 rounded shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-team.png'
                  }}
                />
                <span className="font-medium truncate text-sm sm:text-base">{match.teams.home.name}</span>
              </div>
              <motion.div 
                className={cn(
                  "text-xl sm:text-2xl font-bold min-w-[1.5rem] sm:min-w-[2rem] text-center",
                  isLive && "animate-score-pop"
                )}
                key={`home-${match.goals.home}`}
                initial={isLive ? { scale: 1.2 } : false}
                animate={isLive ? { scale: 1 } : false}
                style={isLive ? { color: '#10b981' } : {}}
                transition={{ duration: 0.3 }}
              >
                {match.goals.home ?? '-'}
              </motion.div>
            </div>

            {/* VS divider with status */}
            <div className="flex items-center justify-center">
              <div className={cn(
                "px-2 sm:px-3 py-1 rounded-full text-xs font-medium border",
                getStatusColor(match.fixture.status.short)
              )}>
                {getMatchStatus(match.fixture.status.short, match.fixture.status.elapsed)}
              </div>
            </div>

            {/* Away team */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                <img 
                  src={match.teams.away.logo} 
                  alt={match.teams.away.name}
                  className="h-6 w-6 sm:h-8 sm:w-8 rounded shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-team.png'
                  }}
                />
                <span className="font-medium truncate text-sm sm:text-base">{match.teams.away.name}</span>
              </div>
              <motion.div 
                className={cn(
                  "text-xl sm:text-2xl font-bold min-w-[1.5rem] sm:min-w-[2rem] text-center",
                  isLive && "animate-score-pop"
                )}
                key={`away-${match.goals.away}`}
                initial={isLive ? { scale: 1.2 } : false}
                animate={isLive ? { scale: 1 } : false}
                style={isLive ? { color: '#10b981' } : {}}
                transition={{ duration: 0.3 }}
              >
                {match.goals.away ?? '-'}
              </motion.div>
            </div>
          </div>

          {/* Match details */}
          <motion.div 
            className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t"
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: isHovered ? 1 : 0.7, 
              height: 'auto' 
            }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center space-x-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{match.fixture.venue.name}</span>
            </div>
            
            {isFinished && (
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>FT</span>
              </div>
            )}
          </motion.div>

          {/* Hover actions */}
          <motion.div
            className="flex space-x-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              y: isHovered ? 0 : 10 
            }}
            transition={{ duration: 0.2 }}
          >
            <Button variant="outline" size="sm" className="flex-1 text-xs">
              <Users className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Lineups</span>
              <span className="sm:hidden">Teams</span>
            </Button>
            <Button variant="outline" size="sm" className="flex-1 text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              Stats
            </Button>
          </motion.div>
        </CardContent>

        {/* Animated background for live matches */}
        {isLive && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-green-500/5"
            animate={{ 
              background: [
                'linear-gradient(90deg, rgba(34,197,94,0.05) 0%, transparent 50%, rgba(34,197,94,0.05) 100%)',
                'linear-gradient(90deg, transparent 0%, rgba(34,197,94,0.05) 50%, transparent 100%)',
                'linear-gradient(90deg, rgba(34,197,94,0.05) 0%, transparent 50%, rgba(34,197,94,0.05) 100%)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </Card>
    </motion.div>
  )
}
