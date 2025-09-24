import { z } from 'zod';

// Esquemas de validación
export const auditLogSchema = z.object({
  id: z.string(),
  timestamp: z.date(),
  userId: z.string(),
  userEmail: z.string().email(),
  userName: z.string(),
  action: z.string(),
  resource: z.string(),
  resourceId: z.string().optional(),
  resourceType: z.string(),
  details: z.record(z.any()).optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  sessionId: z.string().optional(),
  workspaceId: z.string().optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical']).default('low'),
  category: z.enum(['authentication', 'authorization', 'data_access', 'data_modification', 'system', 'security', 'compliance']),
  outcome: z.enum(['success', 'failure', 'partial']),
  duration: z.number().optional(), // en milisegundos
  metadata: z.record(z.any()).optional()
});

export const auditFilterSchema = z.object({
  userId: z.string().optional(),
  action: z.string().optional(),
  resourceType: z.string().optional(),
  category: z.string().optional(),
  severity: z.string().optional(),
  outcome: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  workspaceId: z.string().optional(),
  ipAddress: z.string().optional(),
  limit: z.number().min(1).max(1000).default(100),
  offset: z.number().min(0).default(0)
});

export const auditStatsSchema = z.object({
  totalLogs: z.number(),
  logsByCategory: z.record(z.number()),
  logsBySeverity: z.record(z.number()),
  logsByOutcome: z.record(z.number()),
  recentActivity: z.array(z.object({
    timestamp: z.date(),
    action: z.string(),
    user: z.string(),
    resource: z.string()
  })),
  topUsers: z.array(z.object({
    userId: z.string(),
    userName: z.string(),
    count: z.number()
  })),
  topActions: z.array(z.object({
    action: z.string(),
    count: z.number()
  })),
  securityAlerts: z.number(),
  complianceViolations: z.number()
});

export type AuditLog = z.infer<typeof auditLogSchema>;
export type AuditFilter = z.infer<typeof auditFilterSchema>;
export type AuditStats = z.infer<typeof auditStatsSchema>;

// Datos mock
const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    userId: 'user_123',
    userEmail: 'admin@stack21.com',
    userName: 'Admin User',
    action: 'user.login',
    resource: 'authentication',
    resourceType: 'auth',
    details: { method: 'password', rememberMe: true },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    sessionId: 'sess_abc123',
    workspaceId: 'workspace_456',
    severity: 'low',
    category: 'authentication',
    outcome: 'success',
    duration: 150
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    userId: 'user_789',
    userEmail: 'user@example.com',
    userName: 'John Doe',
    action: 'data.create',
    resource: 'project',
    resourceId: 'proj_123',
    resourceType: 'project',
    details: { name: 'New Project', type: 'web_app' },
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    sessionId: 'sess_def456',
    workspaceId: 'workspace_456',
    severity: 'low',
    category: 'data_modification',
    outcome: 'success',
    duration: 300
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    userId: 'user_456',
    userEmail: 'manager@company.com',
    userName: 'Jane Smith',
    action: 'permission.grant',
    resource: 'team_member',
    resourceId: 'member_789',
    resourceType: 'user',
    details: { permission: 'admin', role: 'workspace_admin' },
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
    sessionId: 'sess_ghi789',
    workspaceId: 'workspace_456',
    severity: 'medium',
    category: 'authorization',
    outcome: 'success',
    duration: 200
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
    userId: 'user_999',
    userEmail: 'suspicious@example.com',
    userName: 'Suspicious User',
    action: 'user.login',
    resource: 'authentication',
    resourceType: 'auth',
    details: { method: 'password', attempts: 5 },
    ipAddress: '192.168.1.999',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    sessionId: 'sess_jkl012',
    workspaceId: 'workspace_456',
    severity: 'high',
    category: 'security',
    outcome: 'failure',
    duration: 5000
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
    userId: 'user_123',
    userEmail: 'admin@stack21.com',
    userName: 'Admin User',
    action: 'data.delete',
    resource: 'backup',
    resourceId: 'backup_456',
    resourceType: 'backup',
    details: { name: 'Old Backup', size: '2.4GB' },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    sessionId: 'sess_abc123',
    workspaceId: 'workspace_456',
    severity: 'medium',
    category: 'data_modification',
    outcome: 'success',
    duration: 800
  },
  {
    id: '6',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    userId: 'system',
    userEmail: 'system@stack21.com',
    userName: 'System',
    action: 'backup.create',
    resource: 'backup_system',
    resourceType: 'backup',
    details: { modules: ['users', 'workspaces'], size: '1.2GB' },
    ipAddress: '127.0.0.1',
    sessionId: 'sess_system',
    workspaceId: 'workspace_456',
    severity: 'low',
    category: 'system',
    outcome: 'success',
    duration: 12000
  },
  {
    id: '7',
    timestamp: new Date(Date.now() - 1000 * 60 * 35),
    userId: 'user_789',
    userEmail: 'user@example.com',
    userName: 'John Doe',
    action: 'data.export',
    resource: 'analytics',
    resourceType: 'data',
    details: { format: 'csv', records: 1500 },
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    sessionId: 'sess_def456',
    workspaceId: 'workspace_456',
    severity: 'medium',
    category: 'data_access',
    outcome: 'success',
    duration: 2000
  },
  {
    id: '8',
    timestamp: new Date(Date.now() - 1000 * 60 * 40),
    userId: 'user_456',
    userEmail: 'manager@company.com',
    userName: 'Jane Smith',
    action: 'integration.create',
    resource: 'webhook',
    resourceId: 'webhook_123',
    resourceType: 'integration',
    details: { name: 'Payment Webhook', url: 'https://api.example.com/webhook' },
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
    sessionId: 'sess_ghi789',
    workspaceId: 'workspace_456',
    severity: 'low',
    category: 'data_modification',
    outcome: 'success',
    duration: 400
  }
];

// Categorías disponibles
export const auditCategories = [
  { id: 'authentication', name: 'Autenticación', description: 'Inicios de sesión, cierres de sesión, cambios de contraseña' },
  { id: 'authorization', name: 'Autorización', description: 'Concesión/revocación de permisos, cambios de roles' },
  { id: 'data_access', name: 'Acceso a Datos', description: 'Lectura, exportación, visualización de datos' },
  { id: 'data_modification', name: 'Modificación de Datos', description: 'Creación, actualización, eliminación de datos' },
  { id: 'system', name: 'Sistema', description: 'Operaciones del sistema, backups, mantenimiento' },
  { id: 'security', name: 'Seguridad', description: 'Actividades de seguridad, intentos de acceso no autorizados' },
  { id: 'compliance', name: 'Cumplimiento', description: 'Actividades relacionadas con cumplimiento normativo' }
];

// Niveles de severidad
export const severityLevels = [
  { id: 'low', name: 'Bajo', color: 'green', description: 'Actividades normales del sistema' },
  { id: 'medium', name: 'Medio', color: 'yellow', description: 'Actividades que requieren atención' },
  { id: 'high', name: 'Alto', color: 'orange', description: 'Actividades sospechosas o inusuales' },
  { id: 'critical', name: 'Crítico', color: 'red', description: 'Actividades que requieren acción inmediata' }
];

// Acciones comunes
export const commonActions = [
  'user.login',
  'user.logout',
  'user.create',
  'user.update',
  'user.delete',
  'data.create',
  'data.read',
  'data.update',
  'data.delete',
  'data.export',
  'permission.grant',
  'permission.revoke',
  'role.assign',
  'role.remove',
  'backup.create',
  'backup.restore',
  'integration.create',
  'integration.update',
  'integration.delete',
  'webhook.create',
  'webhook.update',
  'webhook.delete',
  'workflow.create',
  'workflow.update',
  'workflow.execute',
  'workflow.delete'
];

// Funciones de utilidad
export function formatAuditLog(log: AuditLog): string {
  const timestamp = log.timestamp.toLocaleString();
  const user = log.userName || log.userEmail;
  const action = log.action.replace(/\./g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const resource = log.resource;
  
  return `${timestamp} - ${user} ${action} ${resource}`;
}

export function getSeverityColor(severity: string): string {
  const level = severityLevels.find(s => s.id === severity);
  return level?.color || 'gray';
}

export function getCategoryName(category: string): string {
  const cat = auditCategories.find(c => c.id === category);
  return cat?.name || category;
}

export function isSecurityEvent(log: AuditLog): boolean {
  return log.category === 'security' || 
         log.severity === 'high' || 
         log.severity === 'critical' ||
         log.outcome === 'failure';
}

export function isComplianceEvent(log: AuditLog): boolean {
  return log.category === 'compliance' ||
         log.action.includes('export') ||
         log.action.includes('backup') ||
         log.action.includes('delete');
}

// Funciones de API mock
export async function getAuditLogs(filter: Partial<AuditFilter> = {}): Promise<AuditLog[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  let filteredLogs = [...mockAuditLogs];
  
  // Aplicar filtros
  if (filter.userId) {
    filteredLogs = filteredLogs.filter(log => log.userId === filter.userId);
  }
  
  if (filter.action) {
    filteredLogs = filteredLogs.filter(log => log.action.includes(filter.action!));
  }
  
  if (filter.resourceType) {
    filteredLogs = filteredLogs.filter(log => log.resourceType === filter.resourceType);
  }
  
  if (filter.category) {
    filteredLogs = filteredLogs.filter(log => log.category === filter.category);
  }
  
  if (filter.severity) {
    filteredLogs = filteredLogs.filter(log => log.severity === filter.severity);
  }
  
  if (filter.outcome) {
    filteredLogs = filteredLogs.filter(log => log.outcome === filter.outcome);
  }
  
  if (filter.startDate) {
    filteredLogs = filteredLogs.filter(log => log.timestamp >= filter.startDate!);
  }
  
  if (filter.endDate) {
    filteredLogs = filteredLogs.filter(log => log.timestamp <= filter.endDate!);
  }
  
  if (filter.workspaceId) {
    filteredLogs = filteredLogs.filter(log => log.workspaceId === filter.workspaceId);
  }
  
  if (filter.ipAddress) {
    filteredLogs = filteredLogs.filter(log => log.ipAddress === filter.ipAddress);
  }
  
  // Ordenar por timestamp descendente
  filteredLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
  // Aplicar paginación
  const offset = filter.offset || 0;
  const limit = filter.limit || 100;
  
  return filteredLogs.slice(offset, offset + limit);
}

export async function getAuditLogById(id: string): Promise<AuditLog | null> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockAuditLogs.find(log => log.id === id) || null;
}

export async function createAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> {
  await new Promise(resolve => setTimeout(resolve, 50));
  
  const newLog: AuditLog = {
    ...log,
    id: Date.now().toString(),
    timestamp: new Date()
  };
  
  mockAuditLogs.unshift(newLog);
  return newLog;
}

export async function getAuditStats(): Promise<AuditStats> {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const totalLogs = mockAuditLogs.length;
  
  // Estadísticas por categoría
  const logsByCategory = auditCategories.reduce((stats, category) => {
    stats[category.id] = mockAuditLogs.filter(log => log.category === category.id).length;
    return stats;
  }, {} as Record<string, number>);
  
  // Estadísticas por severidad
  const logsBySeverity = severityLevels.reduce((stats, severity) => {
    stats[severity.id] = mockAuditLogs.filter(log => log.severity === severity.id).length;
    return stats;
  }, {} as Record<string, number>);
  
  // Estadísticas por resultado
  const logsByOutcome = {
    success: mockAuditLogs.filter(log => log.outcome === 'success').length,
    failure: mockAuditLogs.filter(log => log.outcome === 'failure').length,
    partial: mockAuditLogs.filter(log => log.outcome === 'partial').length
  };
  
  // Actividad reciente (últimas 10)
  const recentActivity = mockAuditLogs
    .slice(0, 10)
    .map(log => ({
      timestamp: log.timestamp,
      action: log.action,
      user: log.userName || log.userEmail,
      resource: log.resource
    }));
  
  // Top usuarios
  const userCounts = mockAuditLogs.reduce((counts, log) => {
    const key = log.userId;
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);
  
  const topUsers = Object.entries(userCounts)
    .map(([userId, count]) => {
      const log = mockAuditLogs.find(l => l.userId === userId);
      return {
        userId,
        userName: log?.userName || log?.userEmail || 'Unknown',
        count
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  // Top acciones
  const actionCounts = mockAuditLogs.reduce((counts, log) => {
    counts[log.action] = (counts[log.action] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);
  
  const topActions = Object.entries(actionCounts)
    .map(([action, count]) => ({ action, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  // Alertas de seguridad
  const securityAlerts = mockAuditLogs.filter(log => isSecurityEvent(log)).length;
  
  // Violaciones de cumplimiento
  const complianceViolations = mockAuditLogs.filter(log => isComplianceEvent(log)).length;
  
  return {
    totalLogs,
    logsByCategory,
    logsBySeverity,
    logsByOutcome,
    recentActivity,
    topUsers,
    topActions,
    securityAlerts,
    complianceViolations
  };
}

export async function exportAuditLogs(filter: Partial<AuditFilter> = {}, format: 'csv' | 'json' | 'xlsx' = 'csv'): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const logs = await getAuditLogs(filter);
  
  if (format === 'json') {
    return JSON.stringify(logs, null, 2);
  }
  
  if (format === 'csv') {
    const headers = ['Timestamp', 'User', 'Action', 'Resource', 'Category', 'Severity', 'Outcome', 'IP Address'];
    const rows = logs.map(log => [
      log.timestamp.toISOString(),
      log.userName || log.userEmail,
      log.action,
      log.resource,
      log.category,
      log.severity,
      log.outcome,
      log.ipAddress || ''
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
  
  // Para xlsx, devolver JSON (en un entorno real usarías una librería como xlsx)
  return JSON.stringify(logs, null, 2);
}

export async function searchAuditLogs(query: string, filter: Partial<AuditFilter> = {}): Promise<AuditLog[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const logs = await getAuditLogs(filter);
  
  const searchTerm = query.toLowerCase();
  
  return logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm) ||
    log.resource.toLowerCase().includes(searchTerm) ||
    log.userName.toLowerCase().includes(searchTerm) ||
    log.userEmail.toLowerCase().includes(searchTerm) ||
    log.details && JSON.stringify(log.details).toLowerCase().includes(searchTerm)
  );
}

export async function getAuditLogsByUser(userId: string, limit: number = 50): Promise<AuditLog[]> {
  return getAuditLogs({ userId, limit });
}

export async function getAuditLogsByResource(resourceType: string, resourceId?: string, limit: number = 50): Promise<AuditLog[]> {
  return getAuditLogs({ resourceType, limit });
}

export async function getSecurityEvents(limit: number = 100): Promise<AuditLog[]> {
  const logs = await getAuditLogs({ limit });
  return logs.filter(log => isSecurityEvent(log));
}

export async function getComplianceEvents(limit: number = 100): Promise<AuditLog[]> {
  const logs = await getAuditLogs({ limit });
  return logs.filter(log => isComplianceEvent(log));
}
