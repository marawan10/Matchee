"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, Users, Activity, Globe, Settings, 
  TrendingUp, AlertTriangle, CheckCircle, Clock,
  Zap, Database, Wifi, Server
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface SystemMetrics {
  activeUsers: number
  totalMatches: number
  apiCalls: number
  uptime: string
  responseTime: number
  errorRate: number
}

interface ApiStatus {
  name: string
  status: 'online' | 'offline' | 'degraded'
  responseTime: number
  lastCheck: Date
}

export function AdminDashboard() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    activeUsers: 1247,
    totalMatches: 156,
    apiCalls: 8934,
    uptime: '99.9%',
    responseTime: 245,
    errorRate: 0.1
  })

  const [apiStatuses, setApiStatuses] = useState<ApiStatus[]>([
    {
      name: 'Football Data API',
      status: 'online',
      responseTime: 120,
      lastCheck: new Date()
    },
    {
      name: 'WebSocket Service',
      status: 'online',
      responseTime: 45,
      lastCheck: new Date()
    },
    {
      name: 'Push Notifications',
      status: 'degraded',
      responseTime: 890,
      lastCheck: new Date()
    },
    {
      name: 'Database',
      status: 'online',
      responseTime: 23,
      lastCheck: new Date()
    }
  ])

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'match_start', message: 'Manchester United vs Liverpool started', time: '2 min ago' },
    { id: 2, type: 'goal', message: 'Goal scored in Real Madrid vs Barcelona', time: '5 min ago' },
    { id: 3, type: 'user_signup', message: '23 new users registered', time: '10 min ago' },
    { id: 4, type: 'api_error', message: 'API rate limit exceeded', time: '15 min ago' },
    { id: 5, type: 'system', message: 'Cache cleared successfully', time: '20 min ago' }
  ])

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10 - 5),
        apiCalls: prev.apiCalls + Math.floor(Math.random() * 50),
        responseTime: Math.max(100, prev.responseTime + Math.floor(Math.random() * 20 - 10))
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: ApiStatus['status']) => {
    switch (status) {
      case 'online': return 'text-green-500'
      case 'degraded': return 'text-yellow-500'
      case 'offline': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getStatusIcon = (status: ApiStatus['status']) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-4 w-4" />
      case 'degraded': return <AlertTriangle className="h-4 w-4" />
      case 'offline': return <AlertTriangle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'match_start': return <Activity className="h-4 w-4 text-blue-500" />
      case 'goal': return <Zap className="h-4 w-4 text-green-500" />
      case 'user_signup': return <Users className="h-4 w-4 text-purple-500" />
      case 'api_error': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'system': return <Settings className="h-4 w-4 text-gray-500" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor system performance and manage Matchee</p>
        </div>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          System Settings
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.activeUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                +12% from last hour
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Live Matches</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalMatches}</div>
              <p className="text-xs text-muted-foreground">
                <Globe className="h-3 w-3 inline mr-1" />
                Across 15 leagues
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Calls</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.apiCalls.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Last 24 hours
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uptime</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.uptime}</div>
              <p className="text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* System Status and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Server className="h-5 w-5" />
              <span>System Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {apiStatuses.map((api, index) => (
              <motion.div
                key={api.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center space-x-3">
                  <div className={cn("flex items-center", getStatusColor(api.status))}>
                    {getStatusIcon(api.status)}
                  </div>
                  <div>
                    <p className="font-medium">{api.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Response: {api.responseTime}ms
                    </p>
                  </div>
                </div>
                <Badge 
                  variant={api.status === 'online' ? 'default' : 'destructive'}
                  className="capitalize"
                >
                  {api.status}
                </Badge>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {getActivityIcon(activity.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Performance Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">{metrics.responseTime}ms</div>
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500">{metrics.errorRate}%</div>
              <p className="text-sm text-muted-foreground">Error Rate</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500">98.7%</div>
              <p className="text-sm text-muted-foreground">Cache Hit Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
