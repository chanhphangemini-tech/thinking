import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/leaderboard - Get leaderboard data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'all' // 'all', 'weekly', 'daily'
    const limit = parseInt(searchParams.get('limit') || '10')
    const userId = searchParams.get('userId')

    // Get all gamification data with user info
    const leaderboardData = await db.gamification.findMany({
      take: limit,
      orderBy: { xp: 'desc' },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    })

    // Get achievements count for each user
    const achievementsCounts = await db.achievement.groupBy({
      by: ['userId'],
      _count: { id: true },
    })

    const achievementsMap = new Map(
      achievementsCounts.map(a => [a.userId, a._count.id])
    )

    // Format leaderboard data
    const leaderboard = leaderboardData.map((entry, index) => ({
      rank: index + 1,
      userId: entry.userId,
      displayName: entry.user.profile?.displayName || entry.user.email?.split('@')[0] || 'Anonymous',
      xp: entry.xp,
      level: entry.level,
      streak: entry.streak,
      achievements: achievementsMap.get(entry.userId) || 0,
    }))

    // Find user's rank if userId is provided
    let userRank = null
    if (userId) {
      const userEntry = await db.gamification.findUnique({
        where: { userId },
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
      })

      if (userEntry) {
        // Count how many users have more XP
        const usersAhead = await db.gamification.count({
          where: { xp: { gt: userEntry.xp } },
        })
        
        const userAchievements = await db.achievement.count({
          where: { userId },
        })

        userRank = {
          rank: usersAhead + 1,
          userId: userEntry.userId,
          displayName: userEntry.user.profile?.displayName || userEntry.user.email?.split('@')[0] || 'Anonymous',
          xp: userEntry.xp,
          level: userEntry.level,
          streak: userEntry.streak,
          achievements: userAchievements,
        }
      }
    }

    // Get stats
    const totalUsers = await db.gamification.count()
    const totalXP = await db.gamification.aggregate({
      _sum: { xp: true },
    })
    const totalAchievements = await db.achievement.count()

    return NextResponse.json({
      leaderboard,
      userRank,
      stats: {
        totalUsers,
        totalXP: totalXP._sum.xp || 0,
        totalAchievements,
      },
    })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
