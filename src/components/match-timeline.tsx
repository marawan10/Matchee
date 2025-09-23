"use client"

import { motion } from 'framer-motion'
import { Target, AlertTriangle, ArrowUpDown, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Match, MatchEvent } from '@/types/match'
import { cn } from '@/lib/utils'

interface MatchTimelineProps {
  match: Match
}

export function MatchTimeline({ match }: MatchTimelineProps) {
  const events = match.events || []

  const getEventIcon = (type: string, detail: string) => {
    switch (type) {
      case 'Goal':
        return <Target className="h-4 w-4 text-green-500" />
      case 'Card':
        return <AlertTriangle className={cn(
          "h-4 w-4",
          detail.includes('Red') ? 'text-red-500' : 'text-yellow-500'
        )} />
      case 'subst':
        return <ArrowUpDown className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getEventColor = (type: string, detail: string) => {
    switch (type) {
      case 'Goal':
        return 'border-green-500 bg-green-500/10'
      case 'Card':
        return detail.includes('Red') 
          ? 'border-red-500 bg-red-500/10' 
          : 'border-yellow-500 bg-yellow-500/10'
      case 'subst':
        return 'border-blue-500 bg-blue-500/10'
      default:
        return 'border-muted bg-muted/10'
    }
  }

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">No match events available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4">Match Timeline</h3>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
            
            <div className="space-y-4">
              {events.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="relative flex items-start space-x-4"
                >
                  {/* Timeline dot */}
                  <div className={cn(
                    "relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2",
                    getEventColor(event.type, event.detail)
                  )}>
                    {getEventIcon(event.type, event.detail)}
                  </div>

                  {/* Event content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          {event.time.elapsed}'
                        </span>
                        <span className="text-sm font-semibold">
                          {event.player.name}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {event.team.name}
                      </div>
                    </div>
                    
                    <div className="mt-1">
                      <span className={cn(
                        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                        event.type === 'Goal' && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
                        event.type === 'Card' && event.detail.includes('Red') && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
                        event.type === 'Card' && !event.detail.includes('Red') && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
                        event.type === 'subst' && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                      )}>
                        {event.detail}
                      </span>
                    </div>

                    {event.assist && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        Assist: {event.assist.name}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
