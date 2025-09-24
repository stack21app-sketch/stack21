import { z } from 'zod';

// Esquemas de validación
export const backupSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  type: z.enum(['manual', 'scheduled', 'automatic']),
  status: z.enum(['pending', 'in_progress', 'completed', 'failed', 'cancelled']),
  modules: z.array(z.string()).min(1, 'Al menos un módulo es requerido'),
  size: z.number().optional(),
  compressedSize: z.number().optional(),
  checksum: z.string().optional(),
  encryptionKey: z.string().optional(),
  storageLocation: z.enum(['local', 's3', 'gcs', 'azure']),
  storagePath: z.string(),
  createdAt: z.date(),
  completedAt: z.date().optional(),
  expiresAt: z.date().optional(),
  createdBy: z.string(),
  metadata: z.record(z.any()).optional()
});

export const restoreSchema = z.object({
  id: z.string(),
  backupId: z.string(),
  status: z.enum(['pending', 'in_progress', 'completed', 'failed', 'cancelled']),
  modules: z.array(z.string()),
  targetWorkspace: z.string().optional(),
  options: z.object({
    overwriteExisting: z.boolean().default(false),
    preserveIds: z.boolean().default(false),
    validateIntegrity: z.boolean().default(true)
  }),
  createdAt: z.date(),
  completedAt: z.date().optional(),
  createdBy: z.string(),
  error: z.string().optional()
});

export const backupScheduleSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  enabled: z.boolean().default(true),
  frequency: z.enum(['hourly', 'daily', 'weekly', 'monthly']),
  time: z.string().optional(), // HH:MM format
  dayOfWeek: z.number().min(0).max(6).optional(), // 0 = Sunday
  dayOfMonth: z.number().min(1).max(31).optional(),
  modules: z.array(z.string()).min(1, 'Al menos un módulo es requerido'),
  retentionDays: z.number().min(1).max(365).default(30),
  storageLocation: z.enum(['local', 's3', 'gcs', 'azure']),
  compression: z.boolean().default(true),
  encryption: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
  createdBy: z.string(),
  lastRun: z.date().optional(),
  nextRun: z.date().optional()
});

export const backupStatsSchema = z.object({
  totalBackups: z.number(),
  totalSize: z.number(),
  averageSize: z.number(),
  successRate: z.number(),
  lastBackup: z.date().optional(),
  nextScheduled: z.date().optional(),
  storageUsage: z.record(z.number()),
  moduleStats: z.record(z.object({
    count: z.number(),
    totalSize: z.number(),
    lastBackup: z.date().optional()
  }))
});

export type Backup = z.infer<typeof backupSchema>;
export type Restore = z.infer<typeof restoreSchema>;
export type BackupSchedule = z.infer<typeof backupScheduleSchema>;
export type BackupStats = z.infer<typeof backupStatsSchema>;

// Datos mock
const mockBackups: Backup[] = [
  {
    id: '1',
    name: 'Backup Completo - Septiembre 2024',
    description: 'Respaldo completo de todos los módulos',
    type: 'scheduled',
    status: 'completed',
    modules: ['users', 'workspaces', 'projects', 'workflows', 'integrations'],
    size: 2048576000, // 2GB
    compressedSize: 512144000, // 512MB
    checksum: 'sha256:abc123def456...',
    encryptionKey: 'enc_key_123',
    storageLocation: 's3',
    storagePath: 'backups/2024/09/backup_20240921_120000.tar.gz',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    createdBy: 'system',
    metadata: {
      version: '1.0.0',
      environment: 'production'
    }
  },
  {
    id: '2',
    name: 'Backup Manual - Usuarios',
    description: 'Respaldo manual de usuarios y permisos',
    type: 'manual',
    status: 'completed',
    modules: ['users', 'permissions'],
    size: 256000000, // 256MB
    compressedSize: 64000000, // 64MB
    checksum: 'sha256:def456ghi789...',
    encryptionKey: 'enc_key_456',
    storageLocation: 'local',
    storagePath: '/backups/manual/users_20240921_150000.tar.gz',
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    completedAt: new Date(Date.now() - 1000 * 60 * 25),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    createdBy: 'user_123',
    metadata: {
      version: '1.0.0',
      environment: 'production'
    }
  },
  {
    id: '3',
    name: 'Backup Automático - Workflows',
    description: 'Respaldo automático de workflows',
    type: 'automatic',
    status: 'in_progress',
    modules: ['workflows'],
    size: 0,
    compressedSize: 0,
    storageLocation: 'gcs',
    storagePath: 'backups/auto/workflows_20240921_160000.tar.gz',
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
    createdBy: 'system',
    metadata: {
      version: '1.0.0',
      environment: 'production'
    }
  }
];

const mockRestores: Restore[] = [
  {
    id: '1',
    backupId: '1',
    status: 'completed',
    modules: ['users', 'workspaces'],
    targetWorkspace: 'workspace_456',
    options: {
      overwriteExisting: true,
      preserveIds: false,
      validateIntegrity: true
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 23.5),
    createdBy: 'user_123'
  },
  {
    id: '2',
    backupId: '2',
    status: 'failed',
    modules: ['users'],
    targetWorkspace: 'workspace_789',
    options: {
      overwriteExisting: false,
      preserveIds: true,
      validateIntegrity: true
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    createdBy: 'user_456',
    error: 'Integrity check failed: checksum mismatch'
  }
];

const mockSchedules: BackupSchedule[] = [
  {
    id: '1',
    name: 'Backup Diario Completo',
    description: 'Respaldo diario de todos los módulos',
    enabled: true,
    frequency: 'daily',
    time: '02:00',
    modules: ['users', 'workspaces', 'projects', 'workflows', 'integrations'],
    retentionDays: 30,
    storageLocation: 's3',
    compression: true,
    encryption: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    createdBy: 'admin',
    lastRun: new Date(Date.now() - 1000 * 60 * 60 * 2),
    nextRun: new Date(Date.now() + 1000 * 60 * 60 * 22)
  },
  {
    id: '2',
    name: 'Backup Semanal - Datos Críticos',
    description: 'Respaldo semanal de datos críticos',
    enabled: true,
    frequency: 'weekly',
    time: '03:00',
    dayOfWeek: 0, // Sunday
    modules: ['users', 'workspaces', 'billing'],
    retentionDays: 90,
    storageLocation: 'gcs',
    compression: true,
    encryption: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
    createdBy: 'admin',
    lastRun: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    nextRun: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5)
  }
];

// Módulos disponibles
export const availableModules = [
  { id: 'users', name: 'Usuarios', description: 'Datos de usuarios y autenticación' },
  { id: 'workspaces', name: 'Workspaces', description: 'Espacios de trabajo y configuración' },
  { id: 'projects', name: 'Proyectos', description: 'Proyectos y archivos' },
  { id: 'workflows', name: 'Workflows', description: 'Flujos de trabajo y automatización' },
  { id: 'integrations', name: 'Integraciones', description: 'Conexiones y configuraciones' },
  { id: 'billing', name: 'Facturación', description: 'Datos de facturación y suscripciones' },
  { id: 'analytics', name: 'Analytics', description: 'Datos de análisis y métricas' },
  { id: 'notifications', name: 'Notificaciones', description: 'Configuraciones de notificaciones' },
  { id: 'webhooks', name: 'Webhooks', description: 'Configuraciones de webhooks' },
  { id: 'team', name: 'Equipos', description: 'Gestión de equipos y permisos' }
];

// Funciones de utilidad
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function calculateCompressionRatio(originalSize: number, compressedSize: number): number {
  if (originalSize === 0) return 0;
  return Math.round(((originalSize - compressedSize) / originalSize) * 100);
}

export function generateBackupName(type: string, modules: string[]): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const moduleStr = modules.length === availableModules.length ? 'completo' : modules.join('-');
  return `backup_${type}_${moduleStr}_${timestamp}`;
}

export function calculateNextRun(schedule: BackupSchedule): Date {
  const now = new Date();
  const nextRun = new Date(now);
  
  switch (schedule.frequency) {
    case 'hourly':
      nextRun.setHours(nextRun.getHours() + 1, 0, 0, 0);
      break;
    case 'daily':
      const [hours, minutes] = schedule.time?.split(':').map(Number) || [2, 0];
      nextRun.setHours(hours, minutes, 0, 0);
      if (nextRun <= now) {
        nextRun.setDate(nextRun.getDate() + 1);
      }
      break;
    case 'weekly':
      const [wHours, wMinutes] = schedule.time?.split(':').map(Number) || [3, 0];
      const dayOfWeek = schedule.dayOfWeek || 0;
      const daysUntilNext = (dayOfWeek - now.getDay() + 7) % 7;
      nextRun.setDate(now.getDate() + (daysUntilNext === 0 ? 7 : daysUntilNext));
      nextRun.setHours(wHours, wMinutes, 0, 0);
      break;
    case 'monthly':
      const [mHours, mMinutes] = schedule.time?.split(':').map(Number) || [4, 0];
      const dayOfMonth = schedule.dayOfMonth || 1;
      nextRun.setMonth(nextRun.getMonth() + 1);
      nextRun.setDate(dayOfMonth);
      nextRun.setHours(mHours, mMinutes, 0, 0);
      break;
  }
  
  return nextRun;
}

// Funciones de API mock
export async function getBackups(): Promise<Backup[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockBackups;
}

export async function getBackupById(id: string): Promise<Backup | null> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockBackups.find(backup => backup.id === id) || null;
}

export async function createBackup(backup: Omit<Backup, 'id' | 'createdAt' | 'status'>): Promise<Backup> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newBackup: Backup = {
    ...backup,
    id: Date.now().toString(),
    createdAt: new Date(),
    status: 'pending'
  };
  
  mockBackups.unshift(newBackup);
  return newBackup;
}

export async function updateBackup(id: string, updates: Partial<Backup>): Promise<Backup | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const index = mockBackups.findIndex(backup => backup.id === id);
  if (index === -1) return null;
  
  mockBackups[index] = { ...mockBackups[index], ...updates };
  return mockBackups[index];
}

export async function deleteBackup(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const index = mockBackups.findIndex(backup => backup.id === id);
  if (index === -1) return false;
  
  mockBackups.splice(index, 1);
  return true;
}

export async function getRestores(): Promise<Restore[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockRestores;
}

export async function getRestoreById(id: string): Promise<Restore | null> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockRestores.find(restore => restore.id === id) || null;
}

export async function createRestore(restore: Omit<Restore, 'id' | 'createdAt' | 'status'>): Promise<Restore> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newRestore: Restore = {
    ...restore,
    id: Date.now().toString(),
    createdAt: new Date(),
    status: 'pending'
  };
  
  mockRestores.unshift(newRestore);
  return newRestore;
}

export async function getSchedules(): Promise<BackupSchedule[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockSchedules;
}

export async function getScheduleById(id: string): Promise<BackupSchedule | null> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockSchedules.find(schedule => schedule.id === id) || null;
}

export async function createSchedule(schedule: Omit<BackupSchedule, 'id' | 'createdAt' | 'nextRun'>): Promise<BackupSchedule> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const nextRun = calculateNextRun(schedule as BackupSchedule);
  const newSchedule: BackupSchedule = {
    ...schedule,
    id: Date.now().toString(),
    createdAt: new Date(),
    nextRun
  };
  
  mockSchedules.push(newSchedule);
  return newSchedule;
}

export async function updateSchedule(id: string, updates: Partial<BackupSchedule>): Promise<BackupSchedule | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const index = mockSchedules.findIndex(schedule => schedule.id === id);
  if (index === -1) return null;
  
  const updatedSchedule = { ...mockSchedules[index], ...updates };
  updatedSchedule.nextRun = calculateNextRun(updatedSchedule);
  updatedSchedule.updatedAt = new Date();
  
  mockSchedules[index] = updatedSchedule;
  return mockSchedules[index];
}

export async function deleteSchedule(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const index = mockSchedules.findIndex(schedule => schedule.id === id);
  if (index === -1) return false;
  
  mockSchedules.splice(index, 1);
  return true;
}

export async function getBackupStats(): Promise<BackupStats> {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const totalBackups = mockBackups.length;
  const totalSize = mockBackups.reduce((sum, backup) => sum + (backup.size || 0), 0);
  const averageSize = totalBackups > 0 ? totalSize / totalBackups : 0;
  const successRate = totalBackups > 0 
    ? (mockBackups.filter(b => b.status === 'completed').length / totalBackups) * 100 
    : 0;
  
  const lastBackup = mockBackups
    .filter(b => b.status === 'completed')
    .sort((a, b) => b.completedAt!.getTime() - a.completedAt!.getTime())[0]?.completedAt;
  
  const nextScheduled = mockSchedules
    .filter(s => s.enabled)
    .sort((a, b) => a.nextRun!.getTime() - b.nextRun!.getTime())[0]?.nextRun;
  
  const storageUsage = mockBackups.reduce((usage, backup) => {
    const location = backup.storageLocation;
    usage[location] = (usage[location] || 0) + (backup.size || 0);
    return usage;
  }, {} as Record<string, number>);
  
  const moduleStats = availableModules.reduce((stats, module) => {
    const moduleBackups = mockBackups.filter(b => b.modules.includes(module.id));
    stats[module.id] = {
      count: moduleBackups.length,
      totalSize: moduleBackups.reduce((sum, b) => sum + (b.size || 0), 0),
      lastBackup: moduleBackups
        .filter(b => b.status === 'completed')
        .sort((a, b) => b.completedAt!.getTime() - a.completedAt!.getTime())[0]?.completedAt
    };
    return stats;
  }, {} as Record<string, { count: number; totalSize: number; lastBackup?: Date }>);
  
  return {
    totalBackups,
    totalSize,
    averageSize,
    successRate: Math.round(successRate * 100) / 100,
    lastBackup,
    nextScheduled,
    storageUsage,
    moduleStats
  };
}

export async function executeBackup(backupId: string): Promise<Backup> {
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simular proceso de backup
  
  const backup = await getBackupById(backupId);
  if (!backup) {
    throw new Error('Backup no encontrado');
  }
  
  // Simular proceso de backup
  const simulatedSize = Math.floor(Math.random() * 1000000000) + 100000000; // 100MB - 1GB
  const simulatedCompressedSize = Math.floor(simulatedSize * 0.3); // 30% compresión
  
  const updatedBackup = await updateBackup(backupId, {
    status: 'completed',
    size: simulatedSize,
    compressedSize: simulatedCompressedSize,
    checksum: `sha256:${Math.random().toString(36).substring(2, 15)}`,
    completedAt: new Date()
  });
  
  return updatedBackup!;
}

export async function executeRestore(restoreId: string): Promise<Restore> {
  await new Promise(resolve => setTimeout(resolve, 3000)); // Simular proceso de restore
  
  const restore = await getRestoreById(restoreId);
  if (!restore) {
    throw new Error('Restore no encontrado');
  }
  
  // Simular proceso de restore
  const success = Math.random() > 0.1; // 90% de éxito
  
  const updatedRestore = await updateRestore(restoreId, {
    status: success ? 'completed' : 'failed',
    completedAt: success ? new Date() : undefined,
    error: success ? undefined : 'Simulated restore failure'
  });
  
  return updatedRestore!;
}

async function updateRestore(id: string, updates: Partial<Restore>): Promise<Restore | null> {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const index = mockRestores.findIndex(restore => restore.id === id);
  if (index === -1) return null;
  
  mockRestores[index] = { ...mockRestores[index], ...updates };
  return mockRestores[index];
}
