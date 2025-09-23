"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, Goal, AlertTriangle, Clock, Trophy, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'

interface Notification {
  id: string
  type: 'goal' | 'card' | 'match_start' | 'match_end' | 'news' | 'reminder'
  title: string
  message: string
  timestamp: Date
  matchId?: number
  teamName?: string
  read: boolean
  priority: 'low' | 'medium' | 'high'
}

interface NotificationsSystemProps {
  className?: string
}

export function NotificationsSystem({ className }: NotificationsSystemProps) {
  const { t, formatTime } = useTranslation()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')

  useEffect(() => {
    // Check notification permission
    if ('Notification' in window) {
      setPermission(Notification.permission)
    }

    // Mock notifications for demo
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'goal',
        title: 'GOAL! Manchester United 1-0',
        message: 'Marcus Rashford scores in the 23rd minute',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        matchId: 123,
        teamName: 'Manchester United',
        read: false,
        priority: 'high'
      },
      {
        id: '2',
        type: 'card',
        title: 'Red Card - Real Madrid',
        message: 'Sergio Ramos receives a red card',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        matchId: 124,
        teamName: 'Real Madrid',
        read: false,
        priority: 'medium'
      },
      {
        id: '3',
        type: 'match_start',
        title: 'Match Starting Soon',
        message: 'Barcelona vs PSG starts in 15 minutes',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        matchId: 125,
        read: true,
        priority: 'medium'
      }
    ]

    setNotifications(mockNotifications)
  }, [])

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result === 'granted'
    }
    return false
  }

  const sendBrowserNotification = (notification: Notification) => {
    if (permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id,
        requireInteraction: notification.priority === 'high'
      })
    }
  }

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    }

    setNotifications(prev => [newNotification, ...prev])
    sendBrowserNotification(newNotification)
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'goal':
        return <Goal className="h-4 w-4 text-green-500" />
      case 'card':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'match_start':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'match_end':
        return <Trophy className="h-4 w-4 text-yellow-500" />
      case 'news':
        return <Users className="h-4 w-4 text-purple-500" />
      case 'reminder':
        return <Bell className="h-4 w-4 text-orange-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Notifications Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 w-80 bg-background border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{t('notifications')}</h3>
                  <div className="flex items-center space-x-2">
                    {permission !== 'granted' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={requestPermission}
                        className="text-xs"
                      >
                        Enable
                      </Button>
                    )}
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-xs"
                      >
                        Mark all read
                      </Button>
                    )}
                    {notifications.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAll}
                        className="text-xs"
                      >
                        Clear all
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  <div className="divide-y divide-border">
                    {notifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          "p-4 hover:bg-muted/50 transition-colors cursor-pointer",
                          !notification.read && "bg-muted/30"
                        )}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className={cn(
                                "text-sm font-medium truncate",
                                !notification.read && "font-semibold"
                              )}>
                                {notification.title}
                              </p>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeNotification(notification.id)
                                }}
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-xs text-muted-foreground">
                                {formatTime(notification.timestamp)}
                              </p>
                              {notification.teamName && (
                                <Badge variant="outline" className="text-xs">
                                  {notification.teamName}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">No notifications yet</p>
                    <p className="text-xs mt-1">You'll see match updates and news here</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
