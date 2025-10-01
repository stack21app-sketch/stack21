// Datos mock para desarrollo sin Supabase
export const mockWorkflows = [];

export const mockNotifications = [
  {
    id: '1',
    user_id: 'user-1',
    title: '¡Bienvenido a Stack21!',
    message: 'Comienza creando tu primer workflow para automatizar tu negocio',
    type: 'info',
    read: false,
    created_at: new Date(Date.now() - 60 * 1000).toISOString()
  }
];

export const mockAnalytics = {
  overview: {
    totalWorkflows: 0,
    activeWorkflows: 0,
    totalExecutions: 0,
    successfulExecutions: 0,
    successRate: 0,
    unreadNotifications: 1,
    estimatedSavings: 0
  },
  recent: {
    recentExecutions: 0,
    recentSuccessRate: 0
  },
  topWorkflows: [],
  dailyMetrics: [
    { date: '2025-09-20', executions: 0, successful: 0, failed: 0 },
    { date: '2025-09-21', executions: 0, successful: 0, failed: 0 },
    { date: '2025-09-22', executions: 0, successful: 0, failed: 0 },
    { date: '2025-09-23', executions: 0, successful: 0, failed: 0 },
    { date: '2025-09-24', executions: 0, successful: 0, failed: 0 },
    { date: '2025-09-25', executions: 0, successful: 0, failed: 0 },
    { date: '2025-09-26', executions: 0, successful: 0, failed: 0 }
  ],
  trends: {
    workflowGrowth: 0,
    executionGrowth: 0
  }
};
