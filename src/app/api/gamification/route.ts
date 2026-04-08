import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { format } from 'date-fns'

// GET /api/gamification - Get user's gamification data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    // Get gamification data
    let gamification = await db.gamification.findUnique({
      where: { userId },
    })

    // Create if doesn't exist
    if (!gamification) {
      gamification = await db.gamification.create({
        data: { userId },
      })
    }

    // Get achievements
    const achievements = await db.achievement.findMany({
      where: { userId },
      orderBy: { earnedAt: 'desc' },
    })

    // Get today's streak data
    const today = format(new Date(), 'yyyy-MM-dd')
    const todayStreak = await db.dailyStreak.findUnique({
      where: { userId_date: { userId, date: today } },
    })

    return NextResponse.json({
      gamification: {
        xp: gamification.xp,
        level: gamification.level,
        streak: gamification.streak,
        longestStreak: gamification.longestStreak,
        lastActive: gamification.lastActive,
      },
      achievements,
      todayActivity: todayStreak?.completed || false,
    })
  } catch (error) {
    console.error('Error fetching gamification data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/gamification - Update gamification data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, xpToAdd, newAchievements, streakUpdate } = body

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    // Get current gamification data
    let gamification = await db.gamification.findUnique({
      where: { userId },
    })

    if (!gamification) {
      gamification = await db.gamification.create({
        data: { userId },
      })
    }

    // Calculate new XP and level
    const newXp = gamification.xp + (xpToAdd || 0)
    
    // Calculate level based on XP thresholds
    const LEVEL_THRESHOLDS = [
      0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200,
      4000, 5000, 6200, 7600, 9200, 11000, 13000, 15200, 17600, 20200,
      23000, 26000, 29200, 32600, 36200, 40000, 44000, 48200, 52600, 57200,
      62000, 67000, 72200, 77600, 83200, 89000, 95000, 101200, 107600, 114200,
      121000, 128000, 135200, 142600, 150200, 158000, 166000, 174200, 182600, 191200,
    ]
    
    let newLevel = 1
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (newXp >= LEVEL_THRESHOLDS[i]) {
        newLevel = i + 1
        break
      }
    }

    // Update gamification
    const updateData: Record<string, unknown> = {
      xp: newXp,
      level: newLevel,
      lastActive: new Date(),
    }

    if (streakUpdate) {
      updateData.streak = streakUpdate.streak
      if (streakUpdate.longestStreak) {
        updateData.longestStreak = streakUpdate.longestStreak
      }
    }

    gamification = await db.gamification.update({
      where: { userId },
      data: updateData,
    })

    // Add new achievements
    if (newAchievements && newAchievements.length > 0) {
      for (const achievementId of newAchievements) {
        try {
          await db.achievement.create({
            data: {
              userId,
              achievement: achievementId,
            },
          })
        } catch {
          // Achievement already exists, skip
        }
      }
    }

    // Record daily activity
    const today = format(new Date(), 'yyyy-MM-dd')
    try {
      await db.dailyStreak.upsert({
        where: { userId_date: { userId, date: today } },
        update: { completed: true, xpEarned: { increment: xpToAdd || 0 } },
        create: { userId, date: today, completed: true, xpEarned: xpToAdd || 0 },
      })
    } catch {
      // Ignore errors
    }

    return NextResponse.json({
      success: true,
      gamification: {
        xp: gamification.xp,
        level: gamification.level,
        streak: gamification.streak,
        longestStreak: gamification.longestStreak,
      },
      levelUp: newLevel > gamification.level,
    })
  } catch (error) {
    console.error('Error updating gamification data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
