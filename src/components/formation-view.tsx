"use client"

import { motion } from 'framer-motion'
import { Users, User, Shield, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Match } from '@/types/match'
import { cn } from '@/lib/utils'

interface FormationViewProps {
  match: Match
}

interface Player {
  id: number
  name: string
  number: number
  position: string
  x: number
  y: number
}

export function FormationView({ match }: FormationViewProps) {
  // Mock lineup data - in real app, this would come from the API
  const homeFormation = "4-3-3"
  const awayFormation = "4-2-3-1"

  const homePlayers: Player[] = [
    // Goalkeeper
    { id: 1, name: "De Gea", number: 1, position: "GK", x: 10, y: 50 },
    // Defense
    { id: 2, name: "Wan-Bissaka", number: 29, position: "RB", x: 25, y: 20 },
    { id: 3, name: "Varane", number: 19, position: "CB", x: 25, y: 40 },
    { id: 4, name: "Martinez", number: 6, position: "CB", x: 25, y: 60 },
    { id: 5, name: "Shaw", number: 23, position: "LB", x: 25, y: 80 },
    // Midfield
    { id: 6, name: "Casemiro", number: 18, position: "CDM", x: 45, y: 35 },
    { id: 7, name: "Eriksen", number: 14, position: "CM", x: 45, y: 50 },
    { id: 8, name: "Bruno", number: 8, position: "CAM", x: 45, y: 65 },
    // Attack
    { id: 9, name: "Antony", number: 21, position: "RW", x: 70, y: 25 },
    { id: 10, name: "Rashford", number: 10, position: "ST", x: 70, y: 50 },
    { id: 11, name: "Sancho", number: 25, position: "LW", x: 70, y: 75 },
  ]

  const awayPlayers: Player[] = [
    // Goalkeeper
    { id: 12, name: "Alisson", number: 1, position: "GK", x: 90, y: 50 },
    // Defense
    { id: 13, name: "Alexander-Arnold", number: 66, position: "RB", x: 75, y: 20 },
    { id: 14, name: "Konate", number: 5, position: "CB", x: 75, y: 40 },
    { id: 15, name: "Van Dijk", number: 4, position: "CB", x: 75, y: 60 },
    { id: 16, name: "Robertson", number: 26, position: "LB", x: 75, y: 80 },
    // Midfield
    { id: 17, name: "Fabinho", number: 3, position: "CDM", x: 55, y: 40 },
    { id: 18, name: "Henderson", number: 14, position: "CM", x: 55, y: 60 },
    { id: 19, name: "Thiago", number: 6, position: "CAM", x: 40, y: 35 },
    { id: 20, name: "Salah", number: 11, position: "RW", x: 40, y: 55 },
    { id: 21, name: "Diaz", number: 23, position: "LW", x: 40, y: 75 },
    // Attack
    { id: 22, name: "Nunez", number: 27, position: "ST", x: 30, y: 50 },
  ]

  const getPositionColor = (position: string) => {
    if (position === 'GK') return 'bg-yellow-500'
    if (['CB', 'RB', 'LB', 'RWB', 'LWB'].includes(position)) return 'bg-blue-500'
    if (['CDM', 'CM', 'CAM', 'RM', 'LM'].includes(position)) return 'bg-green-500'
    return 'bg-red-500' // Forwards
  }

  const PlayerDot = ({ player, isHome }: { player: Player; isHome: boolean }) => (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, delay: player.id * 0.05 }}
      className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
      style={{ left: `${player.x}%`, top: `${player.y}%` }}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
    >
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg transition-all",
        getPositionColor(player.position),
        isHome ? "ring-2 ring-primary/30" : "ring-2 ring-muted-foreground/30"
      )}>
        {player.number}
      </div>
      
      {/* Player name tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {player.name}
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-6">
      {/* Formation Headers */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img 
                  src={match.teams.home.logo} 
                  alt={match.teams.home.name}
                  className="h-6 w-6 rounded"
                />
                <span>{match.teams.home.name}</span>
              </div>
              <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                {homeFormation}
              </span>
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img 
                  src={match.teams.away.logo} 
                  alt={match.teams.away.name}
                  className="h-6 w-6 rounded"
                />
                <span>{match.teams.away.name}</span>
              </div>
              <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                {awayFormation}
              </span>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Football Pitch */}
      <Card>
        <CardContent className="p-6">
          <div className="relative w-full h-96 bg-gradient-to-r from-green-400 to-green-500 rounded-lg overflow-hidden">
            {/* Pitch markings */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 60">
              {/* Pitch outline */}
              <rect x="2" y="2" width="96" height="56" fill="none" stroke="white" strokeWidth="0.3" />
              
              {/* Center line */}
              <line x1="50" y1="2" x2="50" y2="58" stroke="white" strokeWidth="0.3" />
              
              {/* Center circle */}
              <circle cx="50" cy="30" r="8" fill="none" stroke="white" strokeWidth="0.3" />
              
              {/* Penalty areas */}
              <rect x="2" y="12" width="16" height="36" fill="none" stroke="white" strokeWidth="0.3" />
              <rect x="82" y="12" width="16" height="36" fill="none" stroke="white" strokeWidth="0.3" />
              
              {/* Goal areas */}
              <rect x="2" y="20" width="6" height="20" fill="none" stroke="white" strokeWidth="0.3" />
              <rect x="92" y="20" width="6" height="20" fill="none" stroke="white" strokeWidth="0.3" />
              
              {/* Penalty spots */}
              <circle cx="12" cy="30" r="0.5" fill="white" />
              <circle cx="88" cy="30" r="0.5" fill="white" />
            </svg>

            {/* Players */}
            {homePlayers.map(player => (
              <PlayerDot key={player.id} player={player} isHome={true} />
            ))}
            {awayPlayers.map(player => (
              <PlayerDot key={player.id} player={player} isHome={false} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Position Legend */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Position Legend</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span className="text-sm">Goalkeeper</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span className="text-sm">Defenders</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-sm">Midfielders</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-sm">Forwards</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
