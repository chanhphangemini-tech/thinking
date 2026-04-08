'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Trophy, Medal, Crown, Flame, Sparkles, Users, Target } from 'lucide-react'
import { LevelBadge } from '@/components/gamification/level-badge'
import { formatXP } from '@/lib/gamification'
import { cn } from '@/lib/utils'

interface LeaderboardEntry {
  rank: number
  userId: string
  displayName: string
  xp: number
  level: number
  streak: number
  achievements: number
}

interface LeaderboardStats {
  totalUsers: number
  totalXP: number
  totalAchievements: number
}

interface LeaderboardViewProps {
  currentUserId?: string
  className?: string
}

const RANK_ICONS: Record<number, { icon: React.ReactNode; color: string; bg: string }> = {
  1: { icon: <Crown className="w-5 h-5" />, color: 'text-amber-400', bg: 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-500/30' },
  2: { icon: <Medal className="w-5 h-5" />, color: 'text-slate-300', bg: 'bg-gradient-to-r from-slate-400/20 to-slate-300/20 border-slate-400/30' },
  3: { icon: <Medal className="w-5 h-5" />, color: 'text-amber-600', bg: 'bg-gradient-to-r from-amber-700/20 to-amber-600/20 border-amber-700/30' },
}

export function LeaderboardView({ currentUserId, className }: LeaderboardViewProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null)
  const [stats, setStats] = useState<LeaderboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const params = new URLSearchParams()
        if (currentUserId) params.append('userId', currentUserId)
        params.append('limit', '10')

        const response = await fetch(`/api/leaderboard?${params}`)
        if (response.ok) {
          const data = await response.json()
          setLeaderboard(data.leaderboard || [])
          setUserRank(data.userRank)
          setStats(data.stats)
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [currentUserId])

  if (loading) {
    return (
      <div className={cn('flex items-center justify-center py-12', className)}>
        <div className="animate-pulse text-white/40">Đang tải bảng xếp hạng...</div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/30">
          <Trophy className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Bảng Xếp Hạng</h1>
          <p className="text-sm text-white/40">Top người học xuất sắc nhất</p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center">
            <Users className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-white">{stats.totalUsers}</div>
            <div className="text-xs text-white/40">Người học</div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center">
            <Sparkles className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-white">{formatXP(stats.totalXP)}</div>
            <div className="text-xs text-white/40">Tổng XP</div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center">
            <Target className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-white">{stats.totalAchievements}</div>
            <div className="text-xs text-white/40">Thành tựu</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-white/5 border border-white/10 w-full grid grid-cols-3">
          <TabsTrigger value="all" className="text-xs">Tất cả</TabsTrigger>
          <TabsTrigger value="weekly" className="text-xs">Tuần này</TabsTrigger>
          <TabsTrigger value="daily" className="text-xs">Hôm nay</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 space-y-3">
          {/* Leaderboard list */}
          <div className="space-y-2">
            {leaderboard.map((entry, index) => {
              const isCurrentUser = entry.userId === currentUserId
              const rankStyle = RANK_ICONS[entry.rank]

              return (
                <motion.div
                  key={entry.userId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-xl border transition-all',
                    isCurrentUser
                      ? 'bg-cyan-500/10 border-cyan-500/30'
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]',
                    rankStyle?.bg && entry.rank <= 3 && rankStyle.bg
                  )}
                >
                  {/* Rank */}
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center font-bold shrink-0',
                    entry.rank <= 3
                      ? cn(rankStyle.color, 'text-lg')
                      : 'text-white/50 text-sm'
                  )}>
                    {entry.rank <= 3 ? rankStyle.icon : `#${entry.rank}`}
                  </div>

                  {/* Level badge */}
                  <LevelBadge level={entry.level} size="sm" showTitle={false} />

                  {/* User info */}
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'font-medium truncate',
                      isCurrentUser ? 'text-cyan-400' : 'text-white'
                    )}>
                      {entry.displayName}
                      {isCurrentUser && ' (Bạn)'}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <Flame className="w-3 h-3 text-orange-400" />
                      <span>{entry.streak} ngày</span>
                      <span>•</span>
                      <span>{entry.achievements} thành tựu</span>
                    </div>
                  </div>

                  {/* XP */}
                  <div className="text-right">
                    <div className="text-sm font-bold text-cyan-400">{formatXP(entry.xp)} XP</div>
                    <div className="text-xs text-white/30">Level {entry.level}</div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* User rank if not in top 10 */}
          {userRank && userRank.rank > 10 && (
            <div className="mt-4">
              <div className="text-center text-xs text-white/30 mb-2">• • •</div>
              <div className={cn(
                'flex items-center gap-3 p-3 rounded-xl border',
                'bg-cyan-500/10 border-cyan-500/30'
              )}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white/50 text-sm">
                  #{userRank.rank}
                </div>
                <LevelBadge level={userRank.level} size="sm" showTitle={false} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-cyan-400">
                    {userRank.displayName} (Bạn)
                  </p>
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <Flame className="w-3 h-3 text-orange-400" />
                    <span>{userRank.streak} ngày</span>
                    <span>•</span>
                    <span>{userRank.achievements} thành tựu</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-cyan-400">{formatXP(userRank.xp)} XP</div>
                  <div className="text-xs text-white/30">Level {userRank.level}</div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="weekly" className="mt-4">
          <div className="text-center py-8 text-white/40">
            Tính năng sắp ra mắt
          </div>
        </TabsContent>

        <TabsContent value="daily" className="mt-4">
          <div className="text-center py-8 text-white/40">
            Tính năng sắp ra mắt
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default LeaderboardView
