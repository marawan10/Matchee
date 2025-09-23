import { MatchDetailView } from '@/components/match-detail-view'
import { Header } from '@/components/header'

interface MatchPageProps {
  params: {
    id: string
  }
}

export default function MatchPage({ params }: MatchPageProps) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <MatchDetailView matchId={params.id} />
      </div>
    </main>
  )
}
