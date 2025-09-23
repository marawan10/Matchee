"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, Play, Clock, Trophy } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MatchCard } from '@/components/match-card'
import { getMatches } from '@/lib/api/football-api'
import { Match } from '@/types/match'
import { cn, getMatchStatus } from '@/lib/utils'

export function LiveMatchesDashboard() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filter, setFilter] = useState<'all' | 'live' | 'finished'>('all')

  const fetchMatches = async () => {
    try {
      setRefreshing(true)
      const data = await getMatches()
      setMatches(data)
    } catch (error) {
      console.error('Failed to fetch matches:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchMatches()
    // Set up auto-refresh every 30 seconds for live matches
    const interval = setInterval(fetchMatches, 30000)
    return () => clearInterval(interval)
  }, [])

  const filteredMatches = matches.filter(match => {
    if (filter === 'live') {
      return ['1H', '2H', 'HT'].includes(match.fixture.status.short)
    }
    if (filter === 'finished') {
      return match.fixture.status.short === 'FT'
    }
    return true
  })

  const liveMatches = matches.filter(match => 
    ['1H', '2H', 'HT'].includes(match.fixture.status.short)
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw className="h-8 w-8 text-primary" />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Live Matches
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            {liveMatches.length} live matches • Updated {new Date().toLocaleTimeString()}
          </p>
        </div>
        
        <Button 
          onClick={fetchMatches}
          disabled={refreshing}
          variant="outline"
          size="sm"
          className="glass shrink-0 self-start sm:self-auto"
        >
          <motion.div
            animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 1, repeat: refreshing ? Infinity : 0, ease: "linear" }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
          </motion.div>
          <span className="hidden sm:inline">Refresh</span>
          <span className="sm:hidden">Sync</span>
        </Button>
      </motion.div>

      {/* Live Matches Banner */}
      {liveMatches.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden rounded-xl bg-gradient-to-r from-green-500/10 via-green-400/5 to-green-500/10 border border-green-500/20 p-6"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent" />
          <div className="relative flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
                <div className="absolute inset-0 h-3 w-3 bg-green-500 rounded-full animate-ping opacity-75" />
              </div>
              <span className="text-green-600 dark:text-green-400 font-semibold">
                {liveMatches.length} LIVE
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Matches happening right now
            </div>
          </div>
        </motion.div>
      )}

      {/* Filter Tabs */}
      <motion.div 
        className="flex space-x-1 bg-muted/50 p-1 rounded-lg w-fit overflow-x-auto scrollbar-hide"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {[
          { key: 'all', label: 'All Matches', icon: Trophy },
          { key: 'live', label: 'Live', icon: Play },
          { key: 'finished', label: 'Finished', icon: Clock },
        ].map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant={filter === key ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter(key as typeof filter)}
            className={cn(
              "relative transition-all duration-200",
              filter === key && "shadow-sm"
            )}
          >
            <Icon className="h-4 w-4 mr-2" />
            {label}
            {key === 'live' && liveMatches.length > 0 && (
              <span className="ml-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {liveMatches.length}
              </span>
            )}
          </Button>
        ))}
      </motion.div>

      {/* Matches Grid */}
      <AnimatePresence mode="wait">
        {filteredMatches.length > 0 ? (
          <motion.div 
            className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filteredMatches.map((match, index) => (
              <motion.div
                key={match.fixture.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <MatchCard match={match} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="text-muted-foreground">
              <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No matches found</p>
              <p className="text-sm">Try adjusting your filter or check back later</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
