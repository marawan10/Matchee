"use client"

import { useState } from 'react'
import { Header } from '@/components/header'
import { Navigation } from '@/components/navigation'
import { LiveMatchesDashboard } from '@/components/live-matches-dashboard'
import { CalendarView } from '@/components/calendar-view'

export default function Home() {
  const [activeTab, setActiveTab] = useState('live')

  const renderContent = () => {
    switch (activeTab) {
      case 'live':
        return <LiveMatchesDashboard />
      case 'calendar':
        return <CalendarView />
      case 'favorites':
        return <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">My Feed</h2>
          <p className="text-muted-foreground">Your favorite teams and matches will appear here</p>
        </div>
      case 'leagues':
        return <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Leagues</h2>
          <p className="text-muted-foreground">Browse all football leagues and competitions</p>
        </div>
      case 'stats':
        return <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Statistics</h2>
          <p className="text-muted-foreground">Player and team statistics</p>
        </div>
      case 'social':
        return <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Social</h2>
          <p className="text-muted-foreground">Connect with other football fans</p>
        </div>
      default:
        return <LiveMatchesDashboard />
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="container mx-auto px-4 py-6">
        {renderContent()}
      </div>
    </main>
  )
}
