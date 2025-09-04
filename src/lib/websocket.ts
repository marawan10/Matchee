"use client"

import { io, Socket } from 'socket.io-client'
import { Match } from '@/types/match'

export interface MatchUpdate {
  matchId: number
  type: 'goal' | 'card' | 'substitution' | 'status_change'
  data: any
  timestamp: number
}

class WebSocketService {
  private socket: Socket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private listeners: Map<string, Function[]> = new Map()

  connect(url: string = 'ws://localhost:3001') {
    if (typeof window === 'undefined') return

    try {
      this.socket = io(url, {
        transports: ['websocket'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay
      })

      this.setupEventListeners()
    } catch (error) {
      console.error('WebSocket connection failed:', error)
      this.fallbackToPolling()
    }
  }

  private setupEventListeners() {
    if (!this.socket) return

    this.socket.on('connect', () => {
      console.log('WebSocket connected')
      this.reconnectAttempts = 0
      this.emit('connected')
    })

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected')
      this.emit('disconnected')
    })

    this.socket.on('match_update', (update: MatchUpdate) => {
      this.emit('match_update', update)
    })

    this.socket.on('live_matches', (matches: Match[]) => {
      this.emit('live_matches', matches)
    })

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error)
      this.handleReconnect()
    })
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => {
        console.log(`Reconnection attempt ${this.reconnectAttempts}`)
        this.socket?.connect()
      }, this.reconnectDelay * this.reconnectAttempts)
    } else {
      console.log('Max reconnection attempts reached, falling back to polling')
      this.fallbackToPolling()
    }
  }

  private fallbackToPolling() {
    // Fallback to HTTP polling when WebSocket fails
    this.emit('fallback_to_polling')
    this.startPolling()
  }

  private startPolling() {
    // Poll for updates every 30 seconds
    const pollInterval = setInterval(async () => {
      try {
        // This would make HTTP requests to get live data
        const response = await fetch('/api/matches/live')
        if (response.ok) {
          const matches = await response.json()
          this.emit('live_matches', matches)
        }
      } catch (error) {
        console.error('Polling failed:', error)
      }
    }, 30000)

    // Store interval ID for cleanup
    this.emit('polling_started', pollInterval)
  }

  // Subscribe to match updates
  subscribeToMatch(matchId: number) {
    if (this.socket?.connected) {
      this.socket.emit('subscribe_match', matchId)
    }
  }

  // Unsubscribe from match updates
  unsubscribeFromMatch(matchId: number) {
    if (this.socket?.connected) {
      this.socket.emit('unsubscribe_match', matchId)
    }
  }

  // Subscribe to live matches
  subscribeToLiveMatches() {
    if (this.socket?.connected) {
      this.socket.emit('subscribe_live_matches')
    }
  }

  // Event listener management
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)?.push(callback)
  }

  off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      const index = eventListeners.indexOf(callback)
      if (index > -1) {
        eventListeners.splice(index, 1)
      }
    }
  }

  private emit(event: string, data?: any) {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data))
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
    this.listeners.clear()
  }

  isConnected(): boolean {
    return this.socket?.connected || false
  }
}

// Create singleton instance
export const websocketService = new WebSocketService()

// React hook for using WebSocket in components
export function useWebSocket() {
  const connect = (url?: string) => websocketService.connect(url)
  const disconnect = () => websocketService.disconnect()
  const subscribeToMatch = (matchId: number) => websocketService.subscribeToMatch(matchId)
  const unsubscribeFromMatch = (matchId: number) => websocketService.unsubscribeFromMatch(matchId)
  const subscribeToLiveMatches = () => websocketService.subscribeToLiveMatches()
  const on = (event: string, callback: Function) => websocketService.on(event, callback)
  const off = (event: string, callback: Function) => websocketService.off(event, callback)
  const isConnected = () => websocketService.isConnected()

  return {
    connect,
    disconnect,
    subscribeToMatch,
    unsubscribeFromMatch,
    subscribeToLiveMatches,
    on,
    off,
    isConnected
  }
}
