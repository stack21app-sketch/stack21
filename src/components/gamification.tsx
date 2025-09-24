'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Trophy, 
  Star, 
  Target, 
  Users, 
  Zap, 
  Crown, 
  Award, 
  Flame,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  Lock,
  Gift,
  Medal,
  Sparkles,
  ArrowRight,
  Eye,
  Play,
  Pause,
  RefreshCw,
  Minus
} from 'lucide-react'
import {
  SAMPLE_USERS,
  AVAILABLE_BADGES,
  AVAILABLE_ACHIEVEMENTS,
  getActiveQuests,
  getLeaderboard,
  getUnlockedBadges,
  calculateLevel,
  getExperienceToNextLevel,
  getRankColor,
  getRarityColor,
  addExperience,
  addPoints,
  updateStreak,
  completeQuest,
  type User,
  type Badge as GamificationBadge,
  type Achievement,
  type Quest,
  type LeaderboardEntry
} from '@/lib/gamification'

export function Gamification() {
  const [selectedTab, setSelectedTab] = useState<'profile' | 'badges' | 'quests' | 'leaderboard' | 'achievements'>('profile')
  const [currentUser, setCurrentUser] = useState<User>(SAMPLE_USERS[0])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [activeQuests, setActiveQuests] = useState<Quest[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    setLeaderboard(getLeaderboard('points', 'all_time'))
    setActiveQuests(getActiveQuests())
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLeaderboard(getLeaderboard('points', 'all_time'))
    setActiveQuests(getActiveQuests())
    setIsRefreshing(false)
  }

  const handleCompleteQuest = (questId: string) => {
    const result = completeQuest(currentUser.id, questId)
    if (result.success) {
      // Aplicar recompensas
      result.rewards.forEach(reward => {
        if (reward.type === 'points') {
          addPoints(currentUser.id, reward.value as number)
        } else if (reward.type === 'experience') {
          addExperience(currentUser.id, reward.value as number)
        }
      })
      
      // Actualizar usuario
      setCurrentUser({ ...currentUser })
      setActiveQuests(getActiveQuests())
    }
  }

  const getLevelProgress = () => {
    const currentLevelExp = (currentUser.level * (currentUser.level - 1)) / 2 * 100
    const nextLevelExp = ((currentUser.level + 1) * currentUser.level) / 2 * 100
    const progress = ((currentUser.experience - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100
    return Math.max(0, Math.min(100, progress))
  }

  const getStreakIcon = (streak: number) => {
    if (streak >= 30) return <Crown className="w-5 h-5 text-yellow-400" />
    if (streak >= 7) return <Trophy className="w-5 h-5 text-orange-400" />
    return <Flame className="w-5 h-5 text-red-400" />
  }

  const getRankIcon = (rank: User['rank']) => {
    switch (rank) {
      case 'diamond': return <Crown className="w-5 h-5 text-purple-400" />
      case 'platinum': return <Award className="w-5 h-5 text-blue-400" />
      case 'gold': return <Medal className="w-5 h-5 text-yellow-400" />
      case 'silver': return <Star className="w-5 h-5 text-gray-400" />
      case 'bronze': return <Trophy className="w-5 h-5 text-amber-600" />
      default: return <Star className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center">
            <Trophy className="w-8 h-8 mr-3 text-yellow-400" />
            Gamificación
          </h2>
          <p className="text-gray-400">Compite, gana puntos y desbloquea logros</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="text-white border-white/20 hover:bg-white/10"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Actualizando...' : 'Actualizar'}
          </Button>
          <Badge className="bg-yellow-500 text-white">
            <Sparkles className="w-3 h-3 mr-1" />
            Nivel {currentUser.level}
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg">
        {[
          { id: 'profile', label: 'Perfil', icon: Users },
          { id: 'badges', label: 'Insignias', icon: Award },
          { id: 'quests', label: 'Misiones', icon: Target },
          { id: 'leaderboard', label: 'Ranking', icon: Trophy },
          { id: 'achievements', label: 'Logros', icon: Star }
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={selectedTab === tab.id ? 'default' : 'ghost'}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`flex-1 ${
              selectedTab === tab.id 
                ? 'bg-yellow-500 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Profile Tab */}
      {selectedTab === 'profile' && (
        <div className="space-y-6">
          {/* User Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  {getRankIcon(currentUser.rank)}
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {currentUser.totalPoints.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Puntos Totales</div>
                <Badge className={`mt-2 ${getRankColor(currentUser.rank)}`}>
                  {currentUser.rank.toUpperCase()}
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  {getStreakIcon(currentUser.currentStreak)}
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {currentUser.currentStreak}
                </div>
                <div className="text-sm text-gray-400">Racha Actual</div>
                <div className="text-xs text-gray-500 mt-1">
                  Mejor: {currentUser.longestStreak} días
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {currentUser.stats.workflowsCreated}
                </div>
                <div className="text-sm text-gray-400">Workflows Creados</div>
                <div className="text-xs text-gray-500 mt-1">
                  {currentUser.stats.workflowsExecuted} ejecutados
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {currentUser.badges.length}
                </div>
                <div className="text-sm text-gray-400">Insignias</div>
                <div className="text-xs text-gray-500 mt-1">
                  {currentUser.achievements.length} logros
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Level Progress */}
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                Progreso de Nivel
              </CardTitle>
              <CardDescription className="text-gray-400">
                Nivel {currentUser.level} • {currentUser.experience} XP
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Nivel {currentUser.level}</span>
                  <span className="text-white">
                    {getExperienceToNextLevel(currentUser.experience)} XP para el siguiente nivel
                  </span>
                </div>
                <Progress value={getLevelProgress()} className="h-3" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{currentUser.experience} XP</span>
                  <span>{((currentUser.level + 1) * currentUser.level) / 2 * 100} XP</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">Productividad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Score</span>
                    <span className="text-white">{currentUser.stats.productivityScore}%</span>
                  </div>
                  <Progress value={currentUser.stats.productivityScore} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">Colaboración</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Score</span>
                    <span className="text-white">{currentUser.stats.collaborationScore}%</span>
                  </div>
                  <Progress value={currentUser.stats.collaborationScore} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">Aprendizaje</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Score</span>
                    <span className="text-white">{currentUser.stats.learningScore}%</span>
                  </div>
                  <Progress value={currentUser.stats.learningScore} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Badges Tab */}
      {selectedTab === 'badges' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Insignias Disponibles</h3>
            <Badge className="bg-blue-500 text-white">
              {currentUser.badges.length} / {AVAILABLE_BADGES.length} Desbloqueadas
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AVAILABLE_BADGES.map((badge) => {
              const isUnlocked = badge.unlockedAt !== undefined
              const progress = badge.maxProgress ? 
                Math.min((badge.progress || 0) / badge.maxProgress * 100, 100) : 0

              return (
                <Card key={badge.id} className={`bg-white/5 backdrop-blur-xl border-white/10 ${
                  isUnlocked ? 'ring-2 ring-yellow-400/50' : ''
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`text-4xl ${isUnlocked ? badge.color : 'text-gray-600'}`}>
                        {badge.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-semibold">{badge.name}</h4>
                          <Badge className={`${getRarityColor(badge.rarity)}`}>
                            {badge.rarity.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-gray-300 text-sm mb-3">{badge.description}</p>
                        
                        {badge.maxProgress && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-400">
                              <span>Progreso</span>
                              <span>{badge.progress || 0} / {badge.maxProgress}</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="text-white text-sm">{badge.points} pts</span>
                          </div>
                          {isUnlocked ? (
                            <div className="flex items-center space-x-1 text-green-400">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm">Desbloqueada</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1 text-gray-400">
                              <Lock className="w-4 h-4" />
                              <span className="text-sm">Bloqueada</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Quests Tab */}
      {selectedTab === 'quests' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Misiones Activas</h3>
            <Badge className="bg-green-500 text-white">
              {activeQuests.length} Disponibles
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeQuests.map((quest) => {
              const isCompleted = quest.completedBy.includes(currentUser.id)
              const progress = quest.progress.find(p => p.userId === currentUser.id)
              const progressPercent = progress ? (progress.progress / 100) * 100 : 0

              return (
                <Card key={quest.id} className={`bg-white/5 backdrop-blur-xl border-white/10 ${
                  isCompleted ? 'ring-2 ring-green-400/50' : ''
                }`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white text-lg">{quest.title}</CardTitle>
                        <CardDescription className="text-gray-400 mt-1">
                          {quest.description}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <Badge className={`${
                          quest.type === 'daily' ? 'bg-blue-500' :
                          quest.type === 'weekly' ? 'bg-purple-500' :
                          'bg-orange-500'
                        } text-white`}>
                          {quest.type === 'daily' ? 'Diaria' :
                           quest.type === 'weekly' ? 'Semanal' : 'Especial'}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-white text-sm">{quest.points} pts</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-white font-medium mb-2">Requisitos:</h5>
                        <ul className="space-y-1">
                          {quest.requirements.map((req, index) => (
                            <li key={index} className="text-gray-300 text-sm flex items-center">
                              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                              {req.description}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="text-white font-medium mb-2">Recompensas:</h5>
                        <div className="flex flex-wrap gap-2">
                          {quest.rewards.map((reward, index) => (
                            <Badge key={index} variant="outline" className="text-gray-300 border-gray-600">
                              {reward.description}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {!isCompleted && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Progreso</span>
                            <span className="text-white">{Math.round(progressPercent)}%</span>
                          </div>
                          <Progress value={progressPercent} className="h-2" />
                        </div>
                      )}

                      <div className="flex space-x-2">
                        {isCompleted ? (
                          <Button disabled className="bg-green-500 text-white flex-1">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Completada
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleCompleteQuest(quest.id)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white flex-1"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Completar
                          </Button>
                        )}
                        <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Leaderboard Tab */}
      {selectedTab === 'leaderboard' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Tabla de Clasificación</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="text-white border-white/20 hover:bg-white/10">
                <Calendar className="w-4 h-4 mr-2" />
                Todos los tiempos
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {leaderboard.map((entry, index) => (
              <Card key={entry.userId} className={`bg-white/5 backdrop-blur-xl border-white/10 ${
                entry.userId === currentUser.id ? 'ring-2 ring-yellow-400/50' : ''
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-gray-700 rounded-full">
                        <span className="text-white font-bold text-sm">
                          {entry.rank}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {entry.userAvatar}
                        </div>
                        <div>
                          <div className="text-white font-semibold flex items-center space-x-2">
                            {entry.userName}
                            {entry.userId === currentUser.id && (
                              <Badge className="bg-yellow-500 text-white text-xs">Tú</Badge>
                            )}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {entry.score.toLocaleString()} puntos
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-white font-semibold">
                          {entry.score.toLocaleString()}
                        </div>
                        <div className="text-gray-400 text-sm">puntos</div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {entry.change > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-400" />
                        ) : entry.change < 0 ? (
                          <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
                        ) : (
                          <Minus className="w-4 h-4 text-gray-400" />
                        )}
                        <span className={`text-sm ${
                          entry.change > 0 ? 'text-green-400' :
                          entry.change < 0 ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          {entry.change > 0 ? '+' : ''}{entry.change}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Achievements Tab */}
      {selectedTab === 'achievements' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Logros</h3>
            <Badge className="bg-purple-500 text-white">
              {currentUser.achievements.length} / {AVAILABLE_ACHIEVEMENTS.length} Desbloqueados
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AVAILABLE_ACHIEVEMENTS.map((achievement) => {
              const isUnlocked = achievement.unlockedAt !== undefined

              return (
                <Card key={achievement.id} className={`bg-white/5 backdrop-blur-xl border-white/10 ${
                  isUnlocked ? 'ring-2 ring-purple-400/50' : ''
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`text-4xl ${isUnlocked ? 'text-purple-400' : 'text-gray-600'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-semibold">{achievement.name}</h4>
                          <Badge className={`${getRarityColor(achievement.rarity)}`}>
                            {achievement.rarity.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-gray-300 text-sm mb-3">{achievement.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="text-white text-sm">{achievement.points} pts</span>
                          </div>
                          {isUnlocked ? (
                            <div className="flex items-center space-x-1 text-green-400">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm">Desbloqueado</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1 text-gray-400">
                              <Lock className="w-4 h-4" />
                              <span className="text-sm">Bloqueado</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
