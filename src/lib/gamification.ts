// Sistema de Gamificación para Stack21
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  level: number
  experience: number
  totalPoints: number
  currentStreak: number
  longestStreak: number
  lastActiveDate: Date
  joinDate: Date
  rank: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'
  badges: Badge[]
  achievements: Achievement[]
  stats: UserStats
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  category: 'workflow' | 'integration' | 'teamwork' | 'learning' | 'milestone'
  points: number
  unlockedAt?: Date
  progress?: number
  maxProgress?: number
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  points: number
  unlockedAt?: Date
  category: 'workflow' | 'integration' | 'teamwork' | 'learning' | 'milestone'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface Quest {
  id: string
  title: string
  description: string
  type: 'daily' | 'weekly' | 'monthly' | 'special'
  category: 'workflow' | 'integration' | 'teamwork' | 'learning'
  points: number
  experience: number
  requirements: QuestRequirement[]
  rewards: QuestReward[]
  isActive: boolean
  startDate: Date
  endDate: Date
  completedBy: string[]
  progress: QuestProgress[]
}

export interface QuestRequirement {
  type: 'workflows_created' | 'workflows_executed' | 'integrations_used' | 'team_collaborations' | 'learning_modules' | 'streak_days'
  target: number
  current: number
  description: string
}

export interface QuestReward {
  type: 'points' | 'experience' | 'badge' | 'badge_id'
  value: number | string
  description: string
}

export interface QuestProgress {
  userId: string
  progress: number
  completedAt?: Date
}

export interface UserStats {
  workflowsCreated: number
  workflowsExecuted: number
  integrationsUsed: number
  teamCollaborations: number
  learningModulesCompleted: number
  totalTimeSpent: number // en minutos
  averageSessionTime: number // en minutos
  productivityScore: number // 0-100
  collaborationScore: number // 0-100
  learningScore: number // 0-100
}

export interface Leaderboard {
  id: string
  name: string
  type: 'points' | 'workflows' | 'streak' | 'teamwork' | 'learning'
  period: 'daily' | 'weekly' | 'monthly' | 'all_time'
  entries: LeaderboardEntry[]
  lastUpdated: Date
}

export interface LeaderboardEntry {
  userId: string
  userName: string
  userAvatar?: string
  rank: number
  score: number
  change: number // cambio desde el período anterior
  badge?: string
}

// Badges disponibles
export const AVAILABLE_BADGES: Badge[] = [
  {
    id: 'first-workflow',
    name: 'Primer Workflow',
    description: 'Creaste tu primer workflow',
    icon: '🎯',
    color: 'text-green-400',
    rarity: 'common',
    category: 'workflow',
    points: 50,
    maxProgress: 1
  },
  {
    id: 'workflow-master',
    name: 'Maestro de Workflows',
    description: 'Creaste 10 workflows',
    icon: '⚡',
    color: 'text-blue-400',
    rarity: 'rare',
    category: 'workflow',
    points: 200,
    maxProgress: 10
  },
  {
    id: 'workflow-legend',
    name: 'Leyenda de Workflows',
    description: 'Creaste 50 workflows',
    icon: '👑',
    color: 'text-purple-400',
    rarity: 'legendary',
    category: 'workflow',
    points: 1000,
    maxProgress: 50
  },
  {
    id: 'integration-expert',
    name: 'Experto en Integraciones',
    description: 'Usaste 5 integraciones diferentes',
    icon: '🔗',
    color: 'text-cyan-400',
    rarity: 'rare',
    category: 'integration',
    points: 300,
    maxProgress: 5
  },
  {
    id: 'team-player',
    name: 'Jugador de Equipo',
    description: 'Colaboraste en 10 proyectos',
    icon: '🤝',
    color: 'text-orange-400',
    rarity: 'epic',
    category: 'teamwork',
    points: 500,
    maxProgress: 10
  },
  {
    id: 'learning-champion',
    name: 'Campeón del Aprendizaje',
    description: 'Completaste 5 módulos de aprendizaje',
    icon: '📚',
    color: 'text-yellow-400',
    rarity: 'epic',
    category: 'learning',
    points: 400,
    maxProgress: 5
  },
  {
    id: 'streak-master',
    name: 'Maestro de Racha',
    description: 'Mantuviste una racha de 7 días',
    icon: '🔥',
    color: 'text-red-400',
    rarity: 'rare',
    category: 'milestone',
    points: 250,
    maxProgress: 7
  },
  {
    id: 'streak-legend',
    name: 'Leyenda de Racha',
    description: 'Mantuviste una racha de 30 días',
    icon: '💎',
    color: 'text-indigo-400',
    rarity: 'legendary',
    category: 'milestone',
    points: 1500,
    maxProgress: 30
  },
  {
    id: 'early-bird',
    name: 'Madrugador',
    description: 'Usaste la plataforma antes de las 8 AM',
    icon: '🌅',
    color: 'text-yellow-300',
    rarity: 'common',
    category: 'milestone',
    points: 100,
    maxProgress: 1
  },
  {
    id: 'night-owl',
    name: 'Búho Nocturno',
    description: 'Usaste la plataforma después de las 10 PM',
    icon: '🦉',
    color: 'text-indigo-300',
    rarity: 'common',
    category: 'milestone',
    points: 100,
    maxProgress: 1
  }
]

// Achievements disponibles
export const AVAILABLE_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-steps',
    name: 'Primeros Pasos',
    description: 'Completaste tu primera acción en Stack21',
    icon: '👶',
    points: 25,
    category: 'milestone',
    rarity: 'common'
  },
  {
    id: 'workflow-wizard',
    name: 'Mago de Workflows',
    description: 'Creaste y ejecutaste 25 workflows exitosamente',
    icon: '🧙‍♂️',
    points: 750,
    category: 'workflow',
    rarity: 'epic'
  },
  {
    id: 'integration-guru',
    name: 'Gurú de Integraciones',
    description: 'Configuraste y usaste 10 integraciones diferentes',
    icon: '🔮',
    points: 600,
    category: 'integration',
    rarity: 'epic'
  },
  {
    id: 'team-leader',
    name: 'Líder de Equipo',
    description: 'Ayudaste a 5 compañeros de equipo',
    icon: '👑',
    points: 800,
    category: 'teamwork',
    rarity: 'legendary'
  },
  {
    id: 'knowledge-seeker',
    name: 'Buscador de Conocimiento',
    description: 'Completaste todos los módulos de aprendizaje',
    icon: '🎓',
    points: 1000,
    category: 'learning',
    rarity: 'legendary'
  },
  {
    id: 'consistency-champion',
    name: 'Campeón de la Consistencia',
    description: 'Usaste Stack21 durante 30 días consecutivos',
    icon: '🏆',
    points: 1200,
    category: 'milestone',
    rarity: 'legendary'
  }
]

// Quests diarios
export const DAILY_QUESTS: Quest[] = [
  {
    id: 'daily-workflow',
    title: 'Creador Diario',
    description: 'Crea un workflow hoy',
    type: 'daily',
    category: 'workflow',
    points: 100,
    experience: 50,
    requirements: [
      {
        type: 'workflows_created',
        target: 1,
        current: 0,
        description: 'Crear 1 workflow'
      }
    ],
    rewards: [
      {
        type: 'points',
        value: 100,
        description: '100 puntos'
      },
      {
        type: 'experience',
        value: 50,
        description: '50 XP'
      }
    ],
    isActive: true,
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    completedBy: [],
    progress: []
  },
  {
    id: 'daily-execution',
    title: 'Ejecutor Activo',
    description: 'Ejecuta 3 workflows hoy',
    type: 'daily',
    category: 'workflow',
    points: 150,
    experience: 75,
    requirements: [
      {
        type: 'workflows_executed',
        target: 3,
        current: 0,
        description: 'Ejecutar 3 workflows'
      }
    ],
    rewards: [
      {
        type: 'points',
        value: 150,
        description: '150 puntos'
      },
      {
        type: 'experience',
        value: 75,
        description: '75 XP'
      }
    ],
    isActive: true,
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    completedBy: [],
    progress: []
  },
  {
    id: 'daily-learning',
    title: 'Aprendiz Curioso',
    description: 'Completa un módulo de aprendizaje',
    type: 'daily',
    category: 'learning',
    points: 200,
    experience: 100,
    requirements: [
      {
        type: 'learning_modules',
        target: 1,
        current: 0,
        description: 'Completar 1 módulo de aprendizaje'
      }
    ],
    rewards: [
      {
        type: 'points',
        value: 200,
        description: '200 puntos'
      },
      {
        type: 'experience',
        value: 100,
        description: '100 XP'
      }
    ],
    isActive: true,
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    completedBy: [],
    progress: []
  }
]

// Quests semanales
export const WEEKLY_QUESTS: Quest[] = [
  {
    id: 'weekly-workflow-master',
    title: 'Maestro Semanal',
    description: 'Crea 5 workflows esta semana',
    type: 'weekly',
    category: 'workflow',
    points: 500,
    experience: 250,
    requirements: [
      {
        type: 'workflows_created',
        target: 5,
        current: 0,
        description: 'Crear 5 workflows'
      }
    ],
    rewards: [
      {
        type: 'points',
        value: 500,
        description: '500 puntos'
      },
      {
        type: 'experience',
        value: 250,
        description: '250 XP'
      },
      {
        type: 'badge',
        value: 'workflow-master',
        description: 'Insignia: Maestro de Workflows'
      }
    ],
    isActive: true,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    completedBy: [],
    progress: []
  },
  {
    id: 'weekly-team-player',
    title: 'Jugador de Equipo',
    description: 'Colabora en 3 proyectos esta semana',
    type: 'weekly',
    category: 'teamwork',
    points: 600,
    experience: 300,
    requirements: [
      {
        type: 'team_collaborations',
        target: 3,
        current: 0,
        description: 'Colaborar en 3 proyectos'
      }
    ],
    rewards: [
      {
        type: 'points',
        value: 600,
        description: '600 puntos'
      },
      {
        type: 'experience',
        value: 300,
        description: '300 XP'
      },
      {
        type: 'badge',
        value: 'team-player',
        description: 'Insignia: Jugador de Equipo'
      }
    ],
    isActive: true,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    completedBy: [],
    progress: []
  }
]

// Usuarios de ejemplo
export const SAMPLE_USERS: User[] = [
  {
    id: 'user-1',
    name: 'María González',
    email: 'maria@stack21.com',
    avatar: 'M',
    level: 15,
    experience: 2450,
    totalPoints: 12500,
    currentStreak: 12,
    longestStreak: 25,
    lastActiveDate: new Date('2024-01-20T15:30:00Z'),
    joinDate: new Date('2023-06-01'),
    rank: 'platinum',
    badges: [
      { ...AVAILABLE_BADGES[0], unlockedAt: new Date('2023-06-02') },
      { ...AVAILABLE_BADGES[1], unlockedAt: new Date('2023-06-15') },
      { ...AVAILABLE_BADGES[3], unlockedAt: new Date('2023-07-01') },
      { ...AVAILABLE_BADGES[6], unlockedAt: new Date('2023-08-15') }
    ],
    achievements: [
      { ...AVAILABLE_ACHIEVEMENTS[0], unlockedAt: new Date('2023-06-01') },
      { ...AVAILABLE_ACHIEVEMENTS[1], unlockedAt: new Date('2023-09-15') }
    ],
    stats: {
      workflowsCreated: 45,
      workflowsExecuted: 234,
      integrationsUsed: 8,
      teamCollaborations: 15,
      learningModulesCompleted: 12,
      totalTimeSpent: 2840,
      averageSessionTime: 45,
      productivityScore: 92,
      collaborationScore: 88,
      learningScore: 85
    }
  },
  {
    id: 'user-2',
    name: 'Carlos Ruiz',
    email: 'carlos@stack21.com',
    avatar: 'C',
    level: 8,
    experience: 1200,
    totalPoints: 6800,
    currentStreak: 5,
    longestStreak: 12,
    lastActiveDate: new Date('2024-01-20T12:15:00Z'),
    joinDate: new Date('2023-08-15'),
    rank: 'silver',
    badges: [
      { ...AVAILABLE_BADGES[0], unlockedAt: new Date('2023-08-16') },
      { ...AVAILABLE_BADGES[2], unlockedAt: new Date('2023-09-01') }
    ],
    achievements: [
      { ...AVAILABLE_ACHIEVEMENTS[0], unlockedAt: new Date('2023-08-15') }
    ],
    stats: {
      workflowsCreated: 18,
      workflowsExecuted: 89,
      integrationsUsed: 4,
      teamCollaborations: 6,
      learningModulesCompleted: 5,
      totalTimeSpent: 1420,
      averageSessionTime: 35,
      productivityScore: 75,
      collaborationScore: 82,
      learningScore: 70
    }
  },
  {
    id: 'user-3',
    name: 'Ana Martínez',
    email: 'ana@stack21.com',
    avatar: 'A',
    level: 22,
    experience: 4200,
    totalPoints: 18900,
    currentStreak: 28,
    longestStreak: 45,
    lastActiveDate: new Date('2024-01-20T09:45:00Z'),
    joinDate: new Date('2023-03-01'),
    rank: 'diamond',
    badges: [
      { ...AVAILABLE_BADGES[0], unlockedAt: new Date('2023-03-02') },
      { ...AVAILABLE_BADGES[1], unlockedAt: new Date('2023-03-15') },
      { ...AVAILABLE_BADGES[2], unlockedAt: new Date('2023-05-01') },
      { ...AVAILABLE_BADGES[3], unlockedAt: new Date('2023-04-01') },
      { ...AVAILABLE_BADGES[4], unlockedAt: new Date('2023-06-01') },
      { ...AVAILABLE_BADGES[5], unlockedAt: new Date('2023-07-01') },
      { ...AVAILABLE_BADGES[6], unlockedAt: new Date('2023-08-01') },
      { ...AVAILABLE_BADGES[7], unlockedAt: new Date('2023-12-01') }
    ],
    achievements: [
      { ...AVAILABLE_ACHIEVEMENTS[0], unlockedAt: new Date('2023-03-01') },
      { ...AVAILABLE_ACHIEVEMENTS[1], unlockedAt: new Date('2023-08-15') },
      { ...AVAILABLE_ACHIEVEMENTS[2], unlockedAt: new Date('2023-10-01') },
      { ...AVAILABLE_ACHIEVEMENTS[3], unlockedAt: new Date('2023-11-15') },
      { ...AVAILABLE_ACHIEVEMENTS[4], unlockedAt: new Date('2023-12-01') },
      { ...AVAILABLE_ACHIEVEMENTS[5], unlockedAt: new Date('2024-01-01') }
    ],
    stats: {
      workflowsCreated: 78,
      workflowsExecuted: 456,
      integrationsUsed: 12,
      teamCollaborations: 28,
      learningModulesCompleted: 18,
      totalTimeSpent: 5200,
      averageSessionTime: 65,
      productivityScore: 98,
      collaborationScore: 95,
      learningScore: 92
    }
  }
]

// Funciones de utilidad
export function calculateLevel(experience: number): number {
  // Cada nivel requiere 100 XP más que el anterior
  // Nivel 1: 0-99 XP, Nivel 2: 100-299 XP, Nivel 3: 300-599 XP, etc.
  return Math.floor((Math.sqrt(8 * experience + 1) - 1) / 2) + 1
}

export function getExperienceForLevel(level: number): number {
  return (level * (level - 1)) / 2 * 100
}

export function getExperienceToNextLevel(currentExperience: number): number {
  const currentLevel = calculateLevel(currentExperience)
  const nextLevelExperience = getExperienceForLevel(currentLevel + 1)
  return nextLevelExperience - currentExperience
}

export function getRankFromLevel(level: number): User['rank'] {
  if (level >= 20) return 'diamond'
  if (level >= 15) return 'platinum'
  if (level >= 10) return 'gold'
  if (level >= 5) return 'silver'
  return 'bronze'
}

export function getRankColor(rank: User['rank']): string {
  switch (rank) {
    case 'bronze': return 'text-amber-600'
    case 'silver': return 'text-gray-400'
    case 'gold': return 'text-yellow-400'
    case 'platinum': return 'text-blue-400'
    case 'diamond': return 'text-purple-400'
    default: return 'text-gray-400'
  }
}

export function getRarityColor(rarity: Badge['rarity']): string {
  switch (rarity) {
    case 'common': return 'text-gray-400'
    case 'rare': return 'text-blue-400'
    case 'epic': return 'text-purple-400'
    case 'legendary': return 'text-yellow-400'
    default: return 'text-gray-400'
  }
}

export function checkBadgeUnlock(user: User, badge: Badge): boolean {
  if (badge.unlockedAt) return true

  switch (badge.id) {
    case 'first-workflow':
      return user.stats.workflowsCreated >= 1
    case 'workflow-master':
      return user.stats.workflowsCreated >= 10
    case 'workflow-legend':
      return user.stats.workflowsCreated >= 50
    case 'integration-expert':
      return user.stats.integrationsUsed >= 5
    case 'team-player':
      return user.stats.teamCollaborations >= 10
    case 'learning-champion':
      return user.stats.learningModulesCompleted >= 5
    case 'streak-master':
      return user.currentStreak >= 7
    case 'streak-legend':
      return user.currentStreak >= 30
    default:
      return false
  }
}

export function getUnlockedBadges(user: User): Badge[] {
  return AVAILABLE_BADGES.filter(badge => checkBadgeUnlock(user, badge))
}

export function getLeaderboard(type: 'points' | 'workflows' | 'streak' | 'teamwork' | 'learning', period: 'daily' | 'weekly' | 'monthly' | 'all_time'): LeaderboardEntry[] {
  let sortedUsers = [...SAMPLE_USERS]

  switch (type) {
    case 'points':
      sortedUsers.sort((a, b) => b.totalPoints - a.totalPoints)
      break
    case 'workflows':
      sortedUsers.sort((a, b) => b.stats.workflowsCreated - a.stats.workflowsCreated)
      break
    case 'streak':
      sortedUsers.sort((a, b) => b.currentStreak - a.currentStreak)
      break
    case 'teamwork':
      sortedUsers.sort((a, b) => b.stats.collaborationScore - a.stats.collaborationScore)
      break
    case 'learning':
      sortedUsers.sort((a, b) => b.stats.learningScore - a.stats.learningScore)
      break
  }

  return sortedUsers.map((user, index) => ({
    userId: user.id,
    userName: user.name,
    userAvatar: user.avatar,
    rank: index + 1,
    score: type === 'points' ? user.totalPoints :
           type === 'workflows' ? user.stats.workflowsCreated :
           type === 'streak' ? user.currentStreak :
           type === 'teamwork' ? user.stats.collaborationScore :
           user.stats.learningScore,
    change: Math.floor(Math.random() * 21) - 10, // -10 a +10
    badge: user.rank
  }))
}

export function getActiveQuests(): Quest[] {
  return [...DAILY_QUESTS, ...WEEKLY_QUESTS].filter(quest => quest.isActive)
}

export function getQuestProgress(userId: string, questId: string): QuestProgress | undefined {
  const quest = getActiveQuests().find(q => q.id === questId)
  return quest?.progress.find(p => p.userId === userId)
}

export function completeQuest(userId: string, questId: string): { success: boolean; rewards: QuestReward[] } {
  const quest = getActiveQuests().find(q => q.id === questId)
  if (!quest) return { success: false, rewards: [] }

  // Simular completar quest
  quest.completedBy.push(userId)
  quest.progress.push({
    userId,
    progress: 100,
    completedAt: new Date()
  })

  return { success: true, rewards: quest.rewards }
}

export function addExperience(userId: string, experience: number): { newLevel: number; leveledUp: boolean } {
  const user = SAMPLE_USERS.find(u => u.id === userId)
  if (!user) return { newLevel: 1, leveledUp: false }

  const oldLevel = user.level
  user.experience += experience
  user.level = calculateLevel(user.experience)
  user.rank = getRankFromLevel(user.level)

  return {
    newLevel: user.level,
    leveledUp: user.level > oldLevel
  }
}

export function addPoints(userId: string, points: number): number {
  const user = SAMPLE_USERS.find(u => u.id === userId)
  if (!user) return 0

  user.totalPoints += points
  return user.totalPoints
}

export function updateStreak(userId: string): { currentStreak: number; longestStreak: number } {
  const user = SAMPLE_USERS.find(u => u.id === userId)
  if (!user) return { currentStreak: 0, longestStreak: 0 }

  const today = new Date()
  const lastActive = new Date(user.lastActiveDate)
  const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24))

  if (daysDiff === 1) {
    // Día consecutivo
    user.currentStreak += 1
  } else if (daysDiff > 1) {
    // Racha rota
    user.currentStreak = 1
  }
  // Si daysDiff === 0, es el mismo día, no hacer nada

  if (user.currentStreak > user.longestStreak) {
    user.longestStreak = user.currentStreak
  }

  user.lastActiveDate = today

  return {
    currentStreak: user.currentStreak,
    longestStreak: user.longestStreak
  }
}
