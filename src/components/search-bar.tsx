"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Clock, Star, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'

interface SearchResult {
  id: string
  type: 'team' | 'player' | 'league' | 'match'
  name: string
  subtitle?: string
  image?: string
  trending?: boolean
}

interface SearchBarProps {
  onSearch?: (query: string) => void
  onResultSelect?: (result: SearchResult) => void
  className?: string
}

export function SearchBar({ onSearch, onResultSelect, className }: SearchBarProps) {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Mock search results - in real app, this would be API calls
  const mockResults: SearchResult[] = [
    { id: '1', type: 'team', name: 'Manchester United', subtitle: 'Premier League', trending: true },
    { id: '2', type: 'team', name: 'Real Madrid', subtitle: 'La Liga' },
    { id: '3', type: 'player', name: 'Cristiano Ronaldo', subtitle: 'Al Nassr' },
    { id: '4', type: 'player', name: 'Lionel Messi', subtitle: 'Inter Miami', trending: true },
    { id: '5', type: 'league', name: 'Premier League', subtitle: 'England' },
    { id: '6', type: 'league', name: 'Champions League', subtitle: 'UEFA' },
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (query.trim()) {
      setLoading(true)
      // Simulate API delay
      const timer = setTimeout(() => {
        const filtered = mockResults.filter(result =>
          result.name.toLowerCase().includes(query.toLowerCase()) ||
          result.subtitle?.toLowerCase().includes(query.toLowerCase())
        )
        setResults(filtered)
        setLoading(false)
      }, 300)

      return () => clearTimeout(timer)
    } else {
      setResults([])
      setLoading(false)
    }
  }, [query, mockResults])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setIsOpen(true)
    onSearch?.(value)
  }

  const handleResultClick = (result: SearchResult) => {
    setQuery(result.name)
    setIsOpen(false)
    
    // Add to recent searches
    const newRecent = [result.name, ...recentSearches.filter(s => s !== result.name)].slice(0, 5)
    setRecentSearches(newRecent)
    
    onResultSelect?.(result)
  }

  const handleRecentClick = (search: string) => {
    setQuery(search)
    setIsOpen(false)
    onSearch?.(search)
  }

  const clearQuery = () => {
    setQuery('')
    setResults([])
    inputRef.current?.focus()
  }

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'team':
        return '⚽'
      case 'player':
        return '👤'
      case 'league':
        return '🏆'
      case 'match':
        return '📅'
      default:
        return '🔍'
    }
  }

  return (
    <div ref={containerRef} className={cn("relative w-full max-w-md", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={t('search')}
          className="w-full pl-10 pr-10 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearQuery}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-80 sm:max-h-96 overflow-y-auto"
          >
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">{t('loading')}</p>
              </div>
            ) : query.trim() ? (
              results.length > 0 ? (
                <div className="py-2">
                  {results.map((result, index) => (
                    <motion.button
                      key={result.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleResultClick(result)}
                      className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center space-x-3"
                    >
                      <span className="text-lg">{getResultIcon(result.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium truncate">{result.name}</p>
                          {result.trending && (
                            <Badge variant="secondary" className="text-xs">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Trending
                            </Badge>
                          )}
                        </div>
                        {result.subtitle && (
                          <p className="text-sm text-muted-foreground truncate">{result.subtitle}</p>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs capitalize">
                        {result.type}
                      </Badge>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No results found for &quot;{query}&quot;</p>
                </div>
              )
            ) : recentSearches.length > 0 ? (
              <div className="py-2">
                <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Recent Searches
                </div>
                {recentSearches.map((search, index) => (
                  <motion.button
                    key={search}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleRecentClick(search)}
                    className="w-full px-4 py-2 text-left hover:bg-muted transition-colors flex items-center space-x-3"
                  >
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{search}</span>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Start typing to search...</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
