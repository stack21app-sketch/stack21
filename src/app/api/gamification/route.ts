import { NextRequest, NextResponse } from 'next/server'
import { 
  SAMPLE_USERS,
  AVAILABLE_BADGES,
  AVAILABLE_ACHIEVEMENTS,
  getActiveQuests,
  getLeaderboard,
  getUnlockedBadges,
  addExperience,
  addPoints,
  updateStreak,
  completeQuest,
  checkBadgeUnlock
} from '@/lib/gamification'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const userId = searchParams.get('userId')

    switch (type) {
      case 'user':
        if (!userId) {
          return NextResponse.json(
            { success: false, error: 'User ID requerido' },
            { status: 400 }
          )
        }
        const user = SAMPLE_USERS.find(u => u.id === userId)
        if (!user) {
          return NextResponse.json(
            { success: false, error: 'Usuario no encontrado' },
            { status: 404 }
          )
        }
        return NextResponse.json({
          success: true,
          data: user
        })

      case 'badges':
        return NextResponse.json({
          success: true,
          data: AVAILABLE_BADGES
        })

      case 'achievements':
        return NextResponse.json({
          success: true,
          data: AVAILABLE_ACHIEVEMENTS
        })

      case 'quests':
        return NextResponse.json({
          success: true,
          data: getActiveQuests()
        })

      case 'leaderboard':
        const leaderboardType = searchParams.get('leaderboardType') || 'points'
        const period = searchParams.get('period') || 'all_time'
        const leaderboard = getLeaderboard(
          leaderboardType as 'points' | 'workflows' | 'streak' | 'teamwork' | 'learning',
          period as 'daily' | 'weekly' | 'monthly' | 'all_time'
        )
        return NextResponse.json({
          success: true,
          data: leaderboard
        })

      case 'stats':
        if (!userId) {
          return NextResponse.json(
            { success: false, error: 'User ID requerido' },
            { status: 400 }
          )
        }
        const userStats = SAMPLE_USERS.find(u => u.id === userId)
        if (!userStats) {
          return NextResponse.json(
            { success: false, error: 'Usuario no encontrado' },
            { status: 404 }
          )
        }
        return NextResponse.json({
          success: true,
          data: {
            level: userStats.level,
            experience: userStats.experience,
            totalPoints: userStats.totalPoints,
            currentStreak: userStats.currentStreak,
            longestStreak: userStats.longestStreak,
            badgesCount: userStats.badges.length,
            achievementsCount: userStats.achievements.length,
            stats: userStats.stats
          }
        })

      default:
        return NextResponse.json({
          success: true,
          data: {
            users: SAMPLE_USERS,
            badges: AVAILABLE_BADGES,
            achievements: AVAILABLE_ACHIEVEMENTS,
            quests: getActiveQuests()
          }
        })
    }
  } catch (error) {
    console.error('Error fetching gamification data:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener los datos de gamificación' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, data } = body

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID requerido' },
        { status: 400 }
      )
    }

    const user = SAMPLE_USERS.find(u => u.id === userId)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    switch (action) {
      case 'add-experience':
        const { experience } = data
        const result = addExperience(userId, experience)
        
        return NextResponse.json({
          success: true,
          message: 'Experiencia agregada correctamente',
          data: {
            newLevel: result.newLevel,
            leveledUp: result.leveledUp,
            experienceAdded: experience
          }
        })

      case 'add-points':
        const { points } = data
        const newTotalPoints = addPoints(userId, points)
        
        return NextResponse.json({
          success: true,
          message: 'Puntos agregados correctamente',
          data: {
            pointsAdded: points,
            newTotalPoints
          }
        })

      case 'update-streak':
        const streakResult = updateStreak(userId)
        
        return NextResponse.json({
          success: true,
          message: 'Racha actualizada correctamente',
          data: {
            currentStreak: streakResult.currentStreak,
            longestStreak: streakResult.longestStreak
          }
        })

      case 'complete-quest':
        const { questId } = data
        const questResult = completeQuest(userId, questId)
        
        if (questResult.success) {
          return NextResponse.json({
            success: true,
            message: 'Misión completada correctamente',
            data: {
              questId,
              rewards: questResult.rewards
            }
          })
        } else {
          return NextResponse.json(
            { success: false, error: 'No se pudo completar la misión' },
            { status: 400 }
          )
        }

      case 'check-badges':
        const unlockedBadges = getUnlockedBadges(user)
        const newBadges = unlockedBadges.filter(badge => 
          !user.badges.some(userBadge => userBadge.id === badge.id)
        )
        
        // Simular desbloqueo de nuevas insignias
        newBadges.forEach(badge => {
          badge.unlockedAt = new Date()
          user.badges.push(badge)
        })
        
        return NextResponse.json({
          success: true,
          message: 'Insignias verificadas correctamente',
          data: {
            newBadges: newBadges.map(badge => ({
              id: badge.id,
              name: badge.name,
              points: badge.points
            })),
            totalBadges: user.badges.length
          }
        })

      case 'update-stats':
        const { stats } = data
        
        // Actualizar estadísticas del usuario
        if (stats.workflowsCreated !== undefined) {
          user.stats.workflowsCreated = stats.workflowsCreated
        }
        if (stats.workflowsExecuted !== undefined) {
          user.stats.workflowsExecuted = stats.workflowsExecuted
        }
        if (stats.integrationsUsed !== undefined) {
          user.stats.integrationsUsed = stats.integrationsUsed
        }
        if (stats.teamCollaborations !== undefined) {
          user.stats.teamCollaborations = stats.teamCollaborations
        }
        if (stats.learningModulesCompleted !== undefined) {
          user.stats.learningModulesCompleted = stats.learningModulesCompleted
        }
        if (stats.totalTimeSpent !== undefined) {
          user.stats.totalTimeSpent = stats.totalTimeSpent
        }
        if (stats.averageSessionTime !== undefined) {
          user.stats.averageSessionTime = stats.averageSessionTime
        }
        if (stats.productivityScore !== undefined) {
          user.stats.productivityScore = stats.productivityScore
        }
        if (stats.collaborationScore !== undefined) {
          user.stats.collaborationScore = stats.collaborationScore
        }
        if (stats.learningScore !== undefined) {
          user.stats.learningScore = stats.learningScore
        }
        
        return NextResponse.json({
          success: true,
          message: 'Estadísticas actualizadas correctamente',
          data: user.stats
        })

      case 'unlock-achievement':
        const { achievementId } = data
        const achievement = AVAILABLE_ACHIEVEMENTS.find(a => a.id === achievementId)
        
        if (!achievement) {
          return NextResponse.json(
            { success: false, error: 'Logro no encontrado' },
            { status: 404 }
          )
        }
        
        // Verificar si ya está desbloqueado
        const alreadyUnlocked = user.achievements.some(a => a.id === achievementId)
        if (alreadyUnlocked) {
          return NextResponse.json(
            { success: false, error: 'Logro ya desbloqueado' },
            { status: 400 }
          )
        }
        
        // Desbloquear logro
        const unlockedAchievement = { ...achievement, unlockedAt: new Date() }
        user.achievements.push(unlockedAchievement)
        
        // Agregar puntos del logro
        addPoints(userId, achievement.points)
        
        return NextResponse.json({
          success: true,
          message: 'Logro desbloqueado correctamente',
          data: {
            achievement: unlockedAchievement,
            pointsEarned: achievement.points
          }
        })

      case 'reset-progress':
        // Resetear progreso del usuario (solo para testing)
        user.level = 1
        user.experience = 0
        user.totalPoints = 0
        user.currentStreak = 0
        user.badges = []
        user.achievements = []
        user.stats = {
          workflowsCreated: 0,
          workflowsExecuted: 0,
          integrationsUsed: 0,
          teamCollaborations: 0,
          learningModulesCompleted: 0,
          totalTimeSpent: 0,
          averageSessionTime: 0,
          productivityScore: 0,
          collaborationScore: 0,
          learningScore: 0
        }
        
        return NextResponse.json({
          success: true,
          message: 'Progreso reseteado correctamente',
          data: user
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Acción no válida' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error processing gamification action:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al procesar la acción de gamificación' 
      },
      { status: 500 }
    )
  }
}