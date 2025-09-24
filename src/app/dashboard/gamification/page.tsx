'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Trophy, 
  Star, 
  Zap, 
  Crown, 
  Flame, 
  Target, 
  Gift, 
  Users, 
  Brain, 
  ShoppingCart,
  Lightbulb,
  HelpCircle,
  Award,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  Lock,
  Unlock,
  Loader2
} from 'lucide-react'
import { useWorkspace } from '@/hooks/use-workspace'

interface UserGamification {
  total_points: number
  current_level: number
  experience_points: number
  experience_to_next_level: number
  streak_days: number
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: string
  points_reward: number
  rarity: string
  is_unlocked: boolean
  unlocked_at?: string
}

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  category: string
  points_reward: number
}

interface Quest {
  id: string
  title: string
  description: string
  quest_type: string
  requirements: any
  rewards: any
  user_progress: {
    progress_data: any
    is_completed: boolean
  }
}

interface LeaderboardEntry {
  position: number
  user: {
    name: string
    image: string | null
  }
  score: number
}

const iconMap = {
  zap: Zap,
  crown: Crown,
  brain: Brain,
  users: Users,
  'shopping-cart': ShoppingCart,
  lightbulb: Lightbulb,
  'help-circle': HelpCircle,
  trophy: Trophy,
  star: Star,
  flame: Flame,
  target: Target,
  gift: Gift,
  award: Award
}

const rarityColors = {
  common: 'bg-gray-100 text-gray-800',
  rare: 'bg-blue-100 text-blue-800',
  epic: 'bg-purple-100 text-purple-800',
  legendary: 'bg-yellow-100 text-yellow-800'
}

export default function GamificationPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { currentWorkspace } = useWorkspace()
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<UserGamification | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [badges, setBadges] = useState<Badge[]>([])
  const [quests, setQuests] = useState<Quest[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [rewards, setRewards] = useState<any[]>([])
  const [recentEvents, setRecentEvents] = useState<any[]>([])

  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  useEffect(() => {
    if (currentWorkspace) {
      fetchGamificationData()
    }
  }, [currentWorkspace])

  const fetchGamificationData = async () => {
    if (!currentWorkspace) return

    setLoading(true)
    try {
      const [overviewRes, achievementsRes, questsRes, leaderboardRes, rewardsRes, eventsRes] = await Promise.all([
        fetch(`/api/gamification?workspaceId=${currentWorkspace.id}&type=overview`),
        fetch(`/api/gamification?workspaceId=${currentWorkspace.id}&type=achievements`),
        fetch(`/api/gamification?workspaceId=${currentWorkspace.id}&type=quests`),
        fetch(`/api/gamification?workspaceId=${currentWorkspace.id}&type=leaderboard`),
        fetch(`/api/gamification?workspaceId=${currentWorkspace.id}&type=rewards`),
        fetch(`/api/gamification?workspaceId=${currentWorkspace.id}&type=events`)
      ])

      const [overview, achievementsData, questsData, leaderboardData, rewardsData, eventsData] = await Promise.all([
        overviewRes.json(),
        achievementsRes.json(),
        questsRes.json(),
        leaderboardRes.json(),
        rewardsRes.json(),
        eventsRes.json()
      ])

      if (overview.success) {
        setUserData(overview.data.user)
        setBadges(overview.data.badges)
        setRecentEvents(overview.data.recent_events)
      }

      if (achievementsData.success) {
        setAchievements(achievementsData.achievements)
      }

      if (questsData.success) {
        setQuests(questsData.quests)
      }

      if (leaderboardData.success) {
        setLeaderboard(leaderboardData.leaderboard)
      }

      if (rewardsData.success) {
        setRewards(rewardsData.rewards)
      }

      if (eventsData.success) {
        setRecentEvents(eventsData.events)
      }
    } catch (error) {
      console.error('Error fetching gamification data:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkAchievements = async () => {
    if (!currentWorkspace) return

    try {
      const response = await fetch('/api/gamification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'check_achievements',
          workspaceId: currentWorkspace.id
        })
      })

      const data = await response.json()
      if (data.success && data.new_achievements.length > 0) {
        alert(`¡Desbloqueaste ${data.new_achievements.length} nuevos logros!`)
        fetchGamificationData() // Refrescar datos
      }
    } catch (error) {
      console.error('Error checking achievements:', error)
    }
  }

  const completeQuest = async (questId: string) => {
    if (!currentWorkspace) return

    try {
      const response = await fetch('/api/gamification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'complete_quest',
          workspaceId: currentWorkspace.id,
          data: { questId }
        })
      })

      const data = await response.json()
      if (data.success) {
        alert(`¡Misión completada! Ganaste ${data.rewards.points} puntos`)
        fetchGamificationData() // Refrescar datos
      }
    } catch (error) {
      console.error('Error completing quest:', error)
    }
  }

  const redeemReward = async (rewardId: string) => {
    if (!currentWorkspace) return

    try {
      const response = await fetch('/api/gamification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'redeem_reward',
          workspaceId: currentWorkspace.id,
          data: { rewardId }
        })
      })

      const data = await response.json()
      if (data.success) {
        alert('¡Recompensa canjeada!')
        fetchGamificationData() // Refrescar datos
      } else {
        alert(data.error || 'Error canjeando recompensa')
      }
    } catch (error) {
      console.error('Error redeeming reward:', error)
    }
  }

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Star
    return IconComponent
  }

  const getRarityColor = (rarity: string) => {
    return rarityColors[rarity as keyof typeof rarityColors] || rarityColors.common
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Trophy className="mr-3 h-8 w-8 text-yellow-600" />
              Gamificación
            </h1>
            <p className="text-gray-600 mt-2">
              Gana puntos, desbloquea logros y compite con tu equipo
            </p>
          </div>
          <Button onClick={checkAchievements} variant="outline">
            <Award className="w-4 h-4 mr-2" />
            Verificar Logros
          </Button>
        </div>

        {/* Stats Overview */}
        {userData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Puntos Totales</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {userData.total_points.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-yellow-100">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Nivel Actual</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {userData.current_level}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100">
                    <Crown className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progreso al siguiente nivel</span>
                    <span>{userData.experience_points}/1000 XP</span>
                  </div>
                  <Progress value={(userData.experience_points / 1000) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Racha Actual</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {userData.streak_days} días
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-orange-100">
                    <Flame className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Posición</p>
                    <p className="text-2xl font-bold text-gray-900">
                      #{3}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-green-100">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="achievements" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="achievements">Logros</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="quests">Misiones</TabsTrigger>
            <TabsTrigger value="leaderboard">Ranking</TabsTrigger>
            <TabsTrigger value="rewards">Recompensas</TabsTrigger>
          </TabsList>

          {/* Logros */}
          <TabsContent value="achievements">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => {
                const IconComponent = getIcon(achievement.icon)
                return (
                  <Card key={achievement.id} className={achievement.is_unlocked ? 'ring-2 ring-green-200' : ''}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-3 rounded-full ${
                            achievement.is_unlocked ? 'bg-green-100' : 'bg-gray-100'
                          }`}>
                            {achievement.is_unlocked ? (
                              <Unlock className="h-6 w-6 text-green-600" />
                            ) : (
                              <Lock className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{achievement.name}</h3>
                            <p className="text-sm text-gray-600">{achievement.description}</p>
                          </div>
                        </div>
                        <Badge className={getRarityColor(achievement.rarity)}>
                          {achievement.rarity}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <IconComponent className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-500">{achievement.points_reward} pts</span>
                        </div>
                        {achievement.is_unlocked && (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span className="text-sm font-medium">Desbloqueado</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Badges */}
          <TabsContent value="badges">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {badges.map((badge) => {
                const IconComponent = getIcon(badge.icon)
                return (
                  <Card key={badge.id}>
                    <CardContent className="p-6 text-center">
                      <div className={`inline-flex p-4 rounded-full bg-${badge.color}-100 mb-4`}>
                        <IconComponent className={`h-8 w-8 text-${badge.color}-600`} />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{badge.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{badge.description}</p>
                      <Badge variant="outline" className="text-xs">
                        {badge.points_reward} pts
                      </Badge>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Misiones */}
          <TabsContent value="quests">
            <div className="space-y-4">
              {quests.map((quest) => (
                <Card key={quest.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Target className="h-5 w-5 text-blue-600" />
                          <h3 className="font-semibold text-gray-900">{quest.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {quest.quest_type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{quest.description}</p>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <Gift className="h-4 w-4 mr-1" />
                            {quest.rewards.points} puntos
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            Diario
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        {quest.user_progress.is_completed ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            <span className="text-sm font-medium">Completada</span>
                          </div>
                        ) : (
                          <Button 
                            onClick={() => completeQuest(quest.id)}
                            size="sm"
                          >
                            Completar
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Leaderboard */}
          <TabsContent value="leaderboard">
            <Card>
              <CardHeader>
                <CardTitle>Ranking Semanal</CardTitle>
                <CardDescription>
                  Los usuarios con más puntos esta semana
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((entry, index) => (
                    <div key={entry.position} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          entry.position === 1 ? 'bg-yellow-100 text-yellow-800' :
                          entry.position === 2 ? 'bg-gray-100 text-gray-800' :
                          entry.position === 3 ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-50 text-gray-600'
                        }`}>
                          {entry.position}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{entry.user.name}</p>
                          <p className="text-sm text-gray-500">{entry.score.toLocaleString()} puntos</p>
                        </div>
                      </div>
                      {entry.position <= 3 && (
                        <Trophy className="h-5 w-5 text-yellow-600" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recompensas */}
          <TabsContent value="rewards">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward) => (
                <Card key={reward.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{reward.name}</h3>
                        <p className="text-sm text-gray-600">{reward.description}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {reward.cost_points} pts
                      </Badge>
                    </div>
                    <Button 
                      onClick={() => redeemReward(reward.id)}
                      className="w-full"
                      disabled={userData ? userData.total_points < reward.cost_points : true}
                    >
                      <Gift className="w-4 h-4 mr-2" />
                      Canjear
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
