import { AdminDashboard } from '@/components/admin-dashboard'
import { Header } from '@/components/header'

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <AdminDashboard />
      </div>
    </main>
  )
}
