"use client"

import { motion } from 'framer-motion'
import { TrendingUp, Target, Activity, Users, Clock, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Match } from '@/types/match'
import { cn } from '@/lib/utils'

interface MatchStatsProps {
  match: Match
}

interface StatItem {
  label: string
  home: number
  away: number
  icon: React.ReactNode
  format?: 'percentage' | 'number'
}

export function MatchStats({ match }: MatchStatsProps) {
  // Mock statistics data - in real app, this would come from the API
  const mockStats: StatItem[] = [
    {
      label: 'Possession',
      home: 58,
      away: 42,
      icon: <Activity className="h-4 w-4" />,
      format: 'percentage'
    },
    {
      label: 'Shots',
      home: 12,
      away: 8,
      icon: <Target className="h-4 w-4" />,
      format: 'number'
    },
    {
      label: 'Shots on Target',
      home: 6,
      away: 3,
      icon: <Zap className="h-4 w-4" />,
      format: 'number'
    },
    {
      label: 'Corners',
      home: 7,
      away: 4,
      icon: <TrendingUp className="h-4 w-4" />,
      format: 'number'
    },
    {
      label: 'Fouls',
      home: 9,
      away: 12,
      icon: <Users className="h-4 w-4" />,
      format: 'number'
    },
    {
      label: 'Pass Accuracy',
      home: 87,
      away: 82,
      icon: <Clock className="h-4 w-4" />,
      format: 'percentage'
    }
  ]

  const StatBar = ({ stat, index }: { stat: StatItem; index: number }) => {
    const total = stat.home + stat.away
    const homePercentage = total > 0 ? (stat.home / total) * 100 : 50
    const awayPercentage = total > 0 ? (stat.away / total) * 100 : 50

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className="space-y-2"
      >
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            {stat.icon}
            <span className="font-medium">{stat.label}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm font-semibold">
          <span className="text-primary">
            {stat.format === 'percentage' ? `${stat.home}%` : stat.home}
          </span>
          <span className="text-muted-foreground">
            {stat.format === 'percentage' ? `${stat.away}%` : stat.away}
          </span>
        </div>

        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${homePercentage}%` }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
          />
          <motion.div
            className="absolute right-0 top-0 h-full bg-muted-foreground rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${awayPercentage}%` }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
          />
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Team Headers */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <img 
                src={match.teams.home.logo} 
                alt={match.teams.home.name}
                className="h-8 w-8 rounded"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-team.png'
                }}
              />
              <span className="font-semibold">{match.teams.home.name}</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="font-semibold">{match.teams.away.name}</span>
              <img 
                src={match.teams.away.logo} 
                alt={match.teams.away.name}
                className="h-8 w-8 rounded"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-team.png'
                }}
              />
            </div>
          </div>

          <div className="space-y-6">
            {mockStats.map((stat, index) => (
              <StatBar key={stat.label} stat={stat} index={index} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Shot Map</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-32 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Shot map visualization</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Heat Map</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-32 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Heat map visualization</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
